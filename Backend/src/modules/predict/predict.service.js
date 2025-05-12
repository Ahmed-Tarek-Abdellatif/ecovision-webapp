import csv from "csvtojson";
import fs from "fs";
import path from "path";
import axios from "axios";
import { Prediction } from "../../db/models/Prediction.model.js";

// Target columns to predict
const TARGET_COLUMNS = [
  "pH_combined",
  "Dissolved Oxygen",
  "Bio-Chemical Oxygen Demand (mg/L)",
  "Turbidity",
  "Solids",
  "Nitrate (mg/ L)",
  "Temperature",
  "Conductivity_combined",
  "Faecal Coliform (MPN/ 100 mL)"
];

// Lag + rolling + EMA = 18 features
const createFeatureMatrix = (series, lags = 15) => {
  const matrix = [];

  for (let i = lags; i < series.length; i++) {
    const row = [];

    // Add lag features
    for (let j = 1; j <= lags; j++) {
      row.push(series[i - j]);
    }

    // Rolling stats over last 5
    const last5 = series.slice(i - 5, i);
    const mean = last5.reduce((a, b) => a + b, 0) / 5;
    const std = Math.sqrt(last5.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / 5);
    const ema = last5.reduce(
      (acc, val, idx) => acc + val * (2 / (5 + 1)) * Math.pow(1 - 2 / (5 + 1), idx),
      0
    );

    row.push(mean, std, ema);
    matrix.push(row);
  }

  return matrix;
};

export const uploadAndPredict = async (req, res, next) => {
  try {
    console.log("File received:", req.file);

    const filePath = req.file.path;
    const filename = req.file.filename;

    // Parse the uploaded CSV file into JSON
    const jsonArray = await csv().fromFile(filePath);
    console.log("CSV Data Parsed:", jsonArray);

    const results = {};

    // Loop through each target column and perform prediction
    for (const column of TARGET_COLUMNS) {
      console.log(`Processing column: ${column}`);

      const series = jsonArray.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
      console.log(`Series for column ${column}:`, series);

      const featureMatrix = createFeatureMatrix(series);

      if (featureMatrix.length === 0) {
        console.log(`Not enough data for column: ${column}`);
        results[column] = { error: "Not enough rows to generate lag-based features" };
        continue;
      }

      try {
        const { data: predictionResponse } = await axios.post("http://127.0.0.1:8000/predict", {
          feature_matrix: featureMatrix,
          target_column: column
        });

        console.log(`Predictions for ${column}:`, predictionResponse[column]);
        results[column] = predictionResponse[column].predictions; // Store predictions for each column
      } catch (err) {
        console.error(`Error predicting for column ${column}:`, err.message);
        results[column] = { error: "Inference failed: " + err.message };
      }
    }

    // Structure the predictions into columns
    const structuredPredictions = [];
    const numRows = Math.max(...Object.values(results).map(pred => pred.length));

    // Combine all predictions into structured rows
    for (let i = 0; i < numRows; i++) {
      const row = {};
      for (const column in results) {
        if (Array.isArray(results[column])) {
          row[column] = results[column][i] || ""; // Ensure missing values are handled
        }
      }
      structuredPredictions.push(row);
    }

    console.log("Structured Predictions:", structuredPredictions);

    // Save the predictions to the database
    const saved = await Prediction.create({
      userId: req.user?.id || null,
      filename,
      predictions: structuredPredictions
    });

    fs.unlinkSync(filePath); // Delete the uploaded file from the server

    return res.status(200).json({
      success: true,
      predictions: structuredPredictions,
      savedId: saved._id
    });
  } catch (err) {
    console.error("Global prediction error:", err);
    return res.status(500).json({
      success: false,
      message: "Prediction failed",
      error: err.message
    });
  }
};

