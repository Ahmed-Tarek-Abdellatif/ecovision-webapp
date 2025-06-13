# app/utils/preprocessing.py
import pandas as pd
import numpy as np
from sklearn.impute import KNNImputer

LAGS = 15

def preprocess_and_generate_features(df_row: pd.DataFrame, target_col: str):
    log = []

    if target_col not in df_row.columns:
        raise ValueError(f"Missing required column: {target_col}")

    # Step 1: Generate lag features
    for i in range(1, LAGS + 1):
        col_name = f"{target_col}_lag_{i}"
        if col_name not in df_row.columns:
            df_row[col_name] = df_row[target_col].shift(i)
            log.append(f"Generated lag feature: {col_name}")

    # Step 2: Rolling features
    if f"{target_col}_rolling_mean" not in df_row.columns:
        df_row[f"{target_col}_rolling_mean"] = df_row[target_col].rolling(window=5).mean()
        log.append("Generated rolling_mean")
    if f"{target_col}_rolling_std" not in df_row.columns:
        df_row[f"{target_col}_rolling_std"] = df_row[target_col].rolling(window=5).std()
        log.append("Generated rolling_std")
    if f"{target_col}_ema" not in df_row.columns:
        df_row[f"{target_col}_ema"] = df_row[target_col].ewm(span=5).mean()
        log.append("Generated EMA")

    # Step 3: Handle missing values using KNN imputation
    imputer = KNNImputer(n_neighbors=10, weights="distance")
    cols_with_na = df_row.columns[df_row.isna().any()]
    if not cols_with_na.empty:
        imputed_part = pd.DataFrame(imputer.fit_transform(df_row[cols_with_na]), columns=cols_with_na, index=df_row.index)
        df_row[cols_with_na] = imputed_part
        log.append(f"Missing values imputed using KNNImputer on columns: {list(cols_with_na)}")

    # Step 4: Outlier handling using IQR method
    for col in df_row.columns:
        Q1 = df_row[col].quantile(0.25)
        Q3 = df_row[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        outliers = ((df_row[col] < lower_bound) | (df_row[col] > upper_bound)).sum()
        if outliers > 0:
            df_row[col] = np.clip(df_row[col], lower_bound, upper_bound)
            log.append(f"Clipped {outliers} outliers in column: {col}")

    # Step 5: Select final feature columns
    feature_cols = [f"{target_col}_lag_{j}" for j in range(1, LAGS + 1)] + [
        f"{target_col}_rolling_mean",
        f"{target_col}_rolling_std",
        f"{target_col}_ema"
    ]

    return df_row, feature_cols, log
