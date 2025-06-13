import os
import joblib

def load_models(model_dir: str, model_map: dict):
    models = {}
    for name, file in model_map.items():
        path = os.path.join(model_dir, file)
        if os.path.exists(path):
            models[name] = joblib.load(path)
        else:
            print(f"⚠️ Model not found: {file}")
    return models

def load_scalers(model_dir: str, scaler_map: dict):
    scalers = {}
    for name, file in scaler_map.items():
        path = os.path.join(model_dir, file)
        if os.path.exists(path):
            scalers[name] = joblib.load(path)
            print(f"✅ Loaded scaler for {name}")
        else:
            print(f"⚠️ Scaler not found: {file}")
    return scalers


