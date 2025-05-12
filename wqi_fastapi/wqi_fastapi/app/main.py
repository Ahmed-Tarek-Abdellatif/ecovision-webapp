from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import os

from app.utils.model_loader import load_models, load_scalers

app = FastAPI(title="WQI XGBoost Predictor")

MODEL_DIR = "app/models"

MODEL_FILES = {
    "pH_combined": "pH_combined_xgb_model.pkl",
    "Dissolved Oxygen": "Dissolved_Oxygen_xgb_model.pkl",
    "Bio-Chemical Oxygen Demand (mg/L)": "Bio-Chemical_Oxygen_Demand_mgL_xgb_model.pkl",
    "Turbidity": "Turbidity_xgb_model.pkl",
    "Solids": "Solids_xgb_model.pkl",
    "Nitrate (mg/ L)": "Nitrate_mg_L_xgb_model.pkl",
    "Temperature": "Temperature_xgb_model.pkl",
    "Conductivity_combined": "Conductivity_combined_xgb_model.pkl",
    "Faecal Coliform (MPN/ 100 mL)": "Faecal_Coliform_MPN_100_mL_xgb_model.pkl"
}

SCALER_FILES = {
    "pH_combined": "pH_combined_target_scaler.pkl",
    "Dissolved Oxygen": "Dissolved_Oxygen_target_scaler.pkl",
    "Bio-Chemical Oxygen Demand (mg/L)": "Bio-Chemical_Oxygen_Demand_mgL_target_scaler.pkl",
    "Turbidity": "Turbidity_target_scaler.pkl",
    "Solids": "Solids_target_scaler.pkl",
    "Nitrate (mg/ L)": "Nitrate_mg_L_target_scaler.pkl",
    "Temperature": "Temperature_target_scaler.pkl",
    "Conductivity_combined": "Conductivity_combined_target_scaler.pkl",
    "Faecal Coliform (MPN/ 100 mL)": "Faecal_Coliform_MPN_100_mL_target_scaler.pkl"
}

# Load models and scalers at startup
models = load_models(MODEL_DIR, MODEL_FILES)
scalers = load_scalers(MODEL_DIR, SCALER_FILES)

# Request schema
class PredictionRequest(BaseModel):
    feature_matrix: List[List[float]]
    target_column: str

@app.get("/")
def root():
    return {"message": "WQI XGBoost Models Ready for Prediction!"}

@app.post("/predict")
def predict(data: PredictionRequest):
    column = data.target_column

    if column not in models:
        raise HTTPException(status_code=404, detail=f"Model for '{column}' not found.")

    model = models[column]
    scaler = scalers.get(column)

    try:
        features = np.array(data.feature_matrix)
        preds = model.predict(features)

        if scaler:
            unscaled_preds = scaler.inverse_transform(preds.reshape(-1, 1)).flatten()
            return {
                column: {
                    "predictions": unscaled_preds.tolist()
                }
            }

        return {
            column: {
                "predictions": preds.tolist()
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")
