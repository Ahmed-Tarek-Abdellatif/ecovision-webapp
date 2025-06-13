import os
import pandas as pd
import numpy as np
import pickle
from datetime import datetime, timedelta
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Literal
from sklearn.impute import SimpleImputer
from scipy.stats import iqr

# === Load models and scalers ===
MODEL_DIR = "app/models"
gases = ["so2", "co", "o3", "pm10", "pm2.5", "no"]
models = {}
scalers = {}

for gas in gases:
    with open(os.path.join(MODEL_DIR, f"svr_model_{gas}.pkl"), "rb") as f:
        models[gas] = pickle.load(f)
    with open(os.path.join(MODEL_DIR, f"scaler_{gas}.pkl"), "rb") as f:
        scalers[gas] = pickle.load(f)

# === AQI Logic ===
AQI_BREAKPOINTS = {
    "us": {
        "pm2.5": [(0, 12, 0, 50), (12.1, 35.4, 51, 100), (35.5, 55.4, 101, 150),
                  (55.5, 150.4, 151, 200), (150.5, 250.4, 201, 300)],
        "pm10": [(0, 54, 0, 50), (55, 154, 51, 100), (155, 254, 101, 150)],
        "so2": [(0, 35, 0, 50), (36, 75, 51, 100), (76, 185, 101, 150)],
        "no": [(0, 53, 0, 50), (54, 100, 51, 100), (101, 360, 101, 150)],
        "co": [(0.0, 4.4, 0, 50), (4.5, 9.4, 51, 100), (9.5, 12.4, 101, 150)],
        "o3": [(0, 54, 0, 50), (55, 70, 51, 100), (71, 85, 101, 150)],
    }
}

def calculate_individual_aqi(pollutant: str, value: float, standard: str = "us") -> int:
    for bp_lo, bp_hi, i_lo, i_hi in AQI_BREAKPOINTS[standard][pollutant]:
        if bp_lo <= value <= bp_hi:
            return int(round(((i_hi - i_lo) / (bp_hi - bp_lo)) * (value - bp_lo) + i_lo))
    return 500  # Default max if out of known range

# === FastAPI App ===
app = FastAPI(title="Lag-Based SVR AQI Predictor")

from sklearn.impute import SimpleImputer
from scipy.stats import iqr

@app.post("/predict-from-csv")
async def predict_from_csv(
    file: UploadFile = File(...),
    start_date: str = Form(...),
    standard: Literal["us"] = Form("us")
):
    df = pd.read_csv(file.file)

    # === Validate presence of gas columns ===
    missing_cols = [gas for gas in gases if gas not in df.columns]
    if missing_cols:
        return JSONResponse(
            content={"error": f"Missing columns in uploaded file: {missing_cols}"},
            status_code=400,
        )

    # ===  Handle missing values ===
    df[gases] = df[gases].replace([np.inf, -np.inf], np.nan)
    imputer = SimpleImputer(strategy="mean")
    df[gases] = imputer.fit_transform(df[gases])

    # ===  Outlier handling using IQR (winsorization) ===
    for gas in gases:
        Q1 = df[gas].quantile(0.25)
        Q3 = df[gas].quantile(0.75)
        iqr_val = Q3 - Q1
        lower_bound = Q1 - 1.5 * iqr_val
        upper_bound = Q3 + 1.5 * iqr_val
        df[gas] = np.clip(df[gas], lower_bound, upper_bound)

    # ===  Generate lag features (1–15) ===
    for gas in gases:
        for lag in range(1, 16):
            df[f"{gas}_lag{lag}"] = df[gas].shift(lag)

    df.dropna(inplace=True)
    df.reset_index(drop=True, inplace=True)

    # === Define full lag features ===
    full_feature_cols = [f"{gas}_lag{lag}" for gas in gases for lag in range(1, 16)]
    if not all(col in df.columns for col in full_feature_cols):
        return JSONResponse(
            content={"error": "Generated lag features are incomplete. Check input data length."},
            status_code=400,
        )

    # ===  Predict and calculate AQI ===
    results = []
    start_datetime = pd.to_datetime(start_date)

    for i, row in df.iterrows():
        row_result = {}
        max_aqi = 0
        try:
            # Use DataFrame to preserve feature names for scaler
            X_row_df = pd.DataFrame([row[full_feature_cols].values], columns=full_feature_cols)
        except Exception as e:
            print(f"❌ Feature error at row {i}: {e}")
            continue

        for gas in gases:
            try:
                X_scaled = scalers[gas].transform(X_row_df)
                pred = models[gas].predict(X_scaled)[0]
                row_result[f"{gas}_pred"] = round(pred, 3)
                aqi = calculate_individual_aqi(gas, pred, standard)
                max_aqi = max(max_aqi, aqi)
            except Exception as e:
                row_result[f"{gas}_pred"] = None
                print(f"⚠️ Prediction error for {gas} at row {i}: {e}")

        row_result["max_aqi"] = max_aqi
        row_result["timestamp"] = (start_datetime + timedelta(hours=i)).strftime("%Y-%m-%d %H:%M:%S")
        results.append(row_result)

    return JSONResponse(content={"results": results})


#uvicorn app.main:app --port 8080 --reload