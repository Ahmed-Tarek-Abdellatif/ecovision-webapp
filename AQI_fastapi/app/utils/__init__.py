import pandas as pd

def prepare_features(values: list[float], lags: int = 15):
    series = pd.Series(values[-(lags + 5):])
    if len(series) < (lags + 5):
        raise ValueError("Not enough data points.")

    features = {}
    for i in range(1, lags + 1):
        features[f"lag_{i}"] = series.iloc[-i]
    features["rolling_mean"] = series.rolling(window=5).mean().iloc[-1]
    features["rolling_std"] = series.rolling(window=5).std().iloc[-1]
    features["ema"] = series.ewm(span=5).mean().iloc[-1]

    return list(features.values())
