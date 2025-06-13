# app/main.py
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from datetime import timedelta
import pandas as pd
import numpy as np
import joblib
import os
import warnings

from app.utils.model_loader import load_models, load_scalers
from app.utils.wqi_calculator import calculate_wqi
from app.utils.preprocessing import preprocess_and_generate_features

warnings.filterwarnings("ignore", category=UserWarning)

app = FastAPI(title="Smart WQI Predictor")

WQI_COLUMNS = [
    'pH_combined', 'Dissolved Oxygen', 'Bio-Chemical Oxygen Demand (mg/L)',
    'Turbidity', 'Solids', 'Nitrate (mg/ L)', 'Temperature',
    'Conductivity_combined', 'Faecal Coliform (MPN/ 100 mL)'
]

MODEL_DIR = "app/models"
MODEL_FILES = {
    col: col.replace(" ", "_").replace("(", "").replace(")", "").replace("/", "").replace("-", "") + "_xgb_model.pkl"
    for col in WQI_COLUMNS
}
SCALER_FILES = {
    col: col.replace(" ", "_").replace("(", "").replace(")", "").replace("/", "").replace("-", "") + "_scaler.pkl"
    for col in WQI_COLUMNS
}

models = load_models(MODEL_DIR, MODEL_FILES)
scalers = load_scalers(MODEL_DIR, SCALER_FILES)

@app.get("/")
def root():
    return {"message": "Smart WQI Prediction API is active."}

@app.post("/predict-wqi-smart")
async def predict_wqi_smart(
    file: UploadFile = File(...),
    start_date: str = Form(default=None),
    limit: int = Form(default=None)
):
    try:
        df = pd.read_csv(file.file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"CSV error: {e}")

    if df.shape[0] < 20:
        raise HTTPException(status_code=400, detail="Input file must contain at least 20 rows for lag/rolling feature generation.")

    all_predictions = pd.DataFrame(index=df.index)
    preprocessing_logs = {}

    for col in WQI_COLUMNS:
        try:
            df_feat, feature_cols, log = preprocess_and_generate_features(df.copy(), col)
            scaler = scalers[col]
            model = models[col]

            # Filter usable rows
            df_feat = df_feat.dropna(subset=feature_cols)
            if df_feat.empty:
                raise ValueError("All rows dropped after preprocessing.")

            X = df_feat[feature_cols].values
            X_full = np.insert(X, 0, 0, axis=1)
            X_scaled = scaler.transform(X_full)
            preds_scaled = model.predict(X_scaled[:, 1:])

            inverse_input = np.zeros_like(X_full)
            inverse_input[:, 0] = preds_scaled
            preds_unscaled = scaler.inverse_transform(inverse_input)[:, 0]

            pred_col_name = f"{col}_pred"
            all_predictions[pred_col_name] = pd.Series(preds_unscaled, index=df_feat.index)
            preprocessing_logs[col] = log

        except Exception as e:
            all_predictions[f"{col}_pred"] = None
            preprocessing_logs[col] = f"Error: {e}"

    # === Assemble final result row-by-row ===
    results = []
    if start_date is None:
        from datetime import datetime
        start_datetime = pd.to_datetime(datetime.now().date())
    else:
        start_datetime = pd.to_datetime(start_date)

    if limit:
        df = df.head(limit)

    for i in range(len(df)):
        row_result = {}
        inputs = {}
        for col in WQI_COLUMNS:
            pred_col = f"{col}_pred"
            val = all_predictions.at[i, pred_col] if i in all_predictions.index else None
            row_result[pred_col] = round(val, 3) if pd.notnull(val) else None
            inputs[col] = val if pd.notnull(val) else None

        wqi_result = calculate_wqi(inputs)
        row_result.update({
            "WQI": round(wqi_result["WQI"], 2),
            "classification": wqi_result["classification"],
            "timestamp": (start_datetime + timedelta(hours=i)).strftime("%Y-%m-%d %H:%M:%S")
        })
        if i == 0:
            row_result["preprocessing"] = preprocessing_logs
        results.append(row_result)

    return JSONResponse(content={"results": results})

#uvicorn app.main:app --host 0.0.0.0 --port 8070 --reload