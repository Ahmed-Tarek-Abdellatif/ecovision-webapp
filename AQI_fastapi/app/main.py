import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Literal
from sklearn.impute import KNNImputer
from joblib import load
from fastapi.middleware.cors import CORSMiddleware

# === Setup
app = FastAPI(title="SVR AQI Predictor")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:5173"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = "app/models"
gases = ["so2", "co", "o3", "pm10", "pm2.5", "no"]
models = {}
scalers = {}

# === Load Models and Scalers (trained on 18 features)
for gas in gases:
    models[gas] = load(os.path.join(MODEL_DIR, f"{gas}_svr_model.pkl"))
    scalers[gas] = load(os.path.join(MODEL_DIR, f"{gas}_xscaler.pkl"))

# === AQI Breakpoints
AQI_BREAKPOINTS = {
    "us": {
        "pm2.5": [(0, 12, 0, 50), (12.1, 35.4, 51, 100), (35.5, 55.4, 101, 150),
                  (55.5, 150.4, 151, 200), (150.5, 250.4, 201, 300)],
        "pm10": [(0, 54, 0, 50), (55, 154, 51, 100), (155, 254, 101, 150)],
        "so2":  [(0, 35, 0, 50), (36, 75, 51, 100), (76, 185, 101, 150)],
        "no":   [(0, 53, 0, 50), (54, 100, 51, 100), (101, 360, 101, 150)],
        "co":   [(0.0, 4.4, 0, 50), (4.5, 9.4, 51, 100), (9.5, 12.4, 101, 150)],
        "o3":   [(0, 54, 0, 50), (55, 70, 51, 100), (71, 85, 101, 150)],
    }
}

def calculate_individual_aqi(pollutant: str, value: float, standard: str = "us") -> int:
    for bp_lo, bp_hi, i_lo, i_hi in AQI_BREAKPOINTS[standard][pollutant]:
        if bp_lo <= value <= bp_hi:
            return int(round(((i_hi - i_lo) / (bp_hi - bp_lo)) * (value - bp_lo) + i_lo))
    return 500

def get_feature_names(gas):
    return [f"{gas}_lag_{i}" for i in range(1, 16)] + [
        "rolling_mean", "rolling_std", "ema"
    ]

@app.post("/predict-from-csv")
async def predict_from_csv(
    file: UploadFile = File(...),
    start_date: str = Form(...),
    standard: Literal["us"] = Form("us")
):
    print("[DEBUG] Received request for /predict-from-csv")
    df = pd.read_csv(file.file)
    print(f"[DEBUG] CSV loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    # === Ensure all required gases are present
    missing_cols = [gas for gas in gases if gas not in df.columns]
    if missing_cols:
        print(f"[DEBUG] Missing columns: {missing_cols}")
        return JSONResponse(content={"error": f"Missing columns: {missing_cols}"}, status_code=400)

    # === Clean and Impute
    df[gases] = df[gases].replace([np.inf, -np.inf], np.nan)
    df[gases] = np.log1p(df[gases])  # log1p for skewed values
    print("[DEBUG] Data cleaned and log1p applied")

    imputer = KNNImputer(n_neighbors=10, weights="distance")
    cols_with_na = df.columns[df.isna().any()]
    if len(cols_with_na) > 0:
        df[cols_with_na] = pd.DataFrame(imputer.fit_transform(df[cols_with_na]), columns=cols_with_na)
    print("[DEBUG] Imputation done")

    # === Winsorization (IQR Clipping)
    for gas in gases:
        Q1 = df[gas].quantile(0.25)
        Q3 = df[gas].quantile(0.75)
        IQR = Q3 - Q1
        df[gas] = np.clip(df[gas], Q1 - 1.5 * IQR, Q3 + 1.5 * IQR)
    print("[DEBUG] Winsorization done")

    # === Add per-gas features (lags + rolling stats)
    for gas in gases:
        for lag in range(1, 16):
            df[f"{gas}_lag_{lag}"] = df[gas].shift(lag)
        df["rolling_mean"] = df[gas].rolling(window=5).mean()
        df["rolling_std"] = df[gas].rolling(window=5).std()
        df["ema"] = df[gas].ewm(span=5).mean()
    print("[DEBUG] Feature engineering done")

    df.dropna(inplace=True)
    df.reset_index(drop=True, inplace=True)
    print(f"[DEBUG] After dropna: {df.shape[0]} rows remain")

    # === Predict row-by-row
    results = []
    start_dt = pd.to_datetime(start_date)

    for i, row in df.iterrows():
        row_result = {}
        max_aqi = 0
        print(f"[DEBUG] Predicting row {i+1}/{df.shape[0]}")
        for gas in gases:
            try:
                features = get_feature_names(gas)
                X_row_df = pd.DataFrame([row[features].values], columns=features)
                X_scaled = scalers[gas].transform(X_row_df)
                pred = models[gas].predict(X_scaled)[0]
                pred_actual = max(0, np.expm1(pred))
                row_result[f"{gas}_pred"] = round(pred_actual, 3)
                aqi = calculate_individual_aqi(gas, pred_actual, standard)
                max_aqi = max(max_aqi, aqi)
            except Exception as e:
                print(f"⚠️ Prediction error for {gas} at row {i}: {e}")
                row_result[f"{gas}_pred"] = None
        row_result["max_aqi"] = max_aqi
        row_result["timestamp"] = (start_dt + timedelta(hours=i)).strftime("%Y-%m-%d %H:%M:%S")
        results.append(row_result)
    print("[DEBUG] Prediction loop complete. Returning results.")
    return JSONResponse(content={"results": results})

#uvicorn app.main:app --port 8080 --reload