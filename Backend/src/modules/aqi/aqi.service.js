import csv from "csvtojson";
import fs from "fs";
import path from "path";
import axios from "axios";
import { AQIPrediction } from "../../db/models/aqiPrediction.model.js";

const AQI_TARGETS = ["so2", "co", "no", "o3", "pm10", "pm2.5"];

const createFeatureMatrix = (series) => {
  const matrix = [];

  for (let i = 5; i < series.length; i++) {
    const row = [];

    // Add 3 lag features
    for (let j = 1; j <= 3; j++) {
      row.push(series[i - j]);
    }

    // Last 5 values for rolling and EMA
    const last5 = series.slice(i - 5, i);
    const mean = last5.reduce((a, b) => a + b, 0) / 5;
    const std = Math.sqrt(
      last5.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / 5
    );
    const ema = last5.reduce(
      (acc, val, idx) =>
        acc + val * (2 / (5 + 1)) * Math.pow(1 - 2 / (5 + 1), idx),
      0
    );

    row.push(mean, std, ema);
    matrix.push(row);
  }

  return matrix;
};

export const uploadAndPredictAQI = async (req, res) => {
  try {
    const filePath = req.file.path;
    const filename = req.file.filename;

    const jsonArray = await csv().fromFile(filePath);
    const results = {};

    for (const column of AQI_TARGETS) {
      const series = jsonArray.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
      const featureMatrix = createFeatureMatrix(series);

      if (featureMatrix.length === 0) {
        results[column] = { error: "❌ Not enough rows for lag features" };
        continue;
      }

      try {
        const { data: predictionResponse } = await axios.post("http://127.0.0.1:8001/predict", {
          feature_matrix: featureMatrix,
          target_column: column
        });

        results[column] = {
            prediction: predictionResponse[column]?.predictions?.at(-1) || null // Only last value
          };
          
      } catch (err) {
        const detail = err.response?.data?.detail;
        const errorMsg = typeof detail === "string" ? detail : JSON.stringify(detail || err.message);
        console.error(`❌ Error predicting ${column}:`, errorMsg);
        results[column] = { error: "Inference failed: " + errorMsg };
      }
    }

    const saved = await AQIPrediction.create({
      userId: req.user?.id || null,
      filename,
      predictions: results
    });

    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      predictions: results,
      savedId: saved._id
    });
  } catch (err) {
    console.error("🔥 AQI prediction error:", err);
    return res.status(500).json({
      success: false,
      message: "Prediction failed",
      error: err.message
    });
  }
};
