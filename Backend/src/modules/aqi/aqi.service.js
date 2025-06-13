import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { AQIPrediction } from "../../db/models/aqiPrediction.model.js";
//---------------------------------------------------------------------------------------------------------------------
export const handleCSVUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required." });
  }

  const filePath = req.file.path;
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("start_date", req.body.start_date || new Date().toISOString());
  form.append("standard", req.body.standard || "us");

  try {
    const response = await axios.post("http://localhost:8080/predict-from-csv", form, {
      headers: form.getHeaders(),
    });

    const predictionResults = response.data.results;

    const saved = await AQIPrediction.create({
      user: req.userExist._id, // ✅ store user ID
      predictions: predictionResults.map(row => ({
        so2_pred: row.so2_pred,
        co_pred: row.co_pred,
        o3_pred: row.o3_pred,
        pm10_pred: row.pm10_pred,
        pm2_5_pred: row["pm2.5_pred"], // Mongo field cannot have dot
        no_pred: row.no_pred,
        max_aqi: row.max_aqi,
        timestamp: row.timestamp,
      })),
      createdAt: new Date(),
    });

    return res.status(200).json({
      message: "Prediction successful",
      savedToDB: saved,
      predictions: predictionResults,
    });

  } catch (err) {
    console.error("Prediction service error:", err.message);
    return res.status(500).json({ error: "Prediction failed", details: err.message });
  } finally {
    fs.unlink(filePath, () => {});
  }
};

//----------------------------------------------------------------------------------------------------------------------------------
const FACTOR = 100; // Choose an appropriate constant

export const calculateGreenArea = async (req, res) => {
  const { totalArea } = req.body;

  if (!totalArea || isNaN(totalArea)) {
    return res.status(400).json({ error: "totalArea must be a number" });
  }

  try {
    // Get the most recent AQI prediction document
    const latestPrediction = await AQIPrediction.findOne().sort({ createdAt: -1 });

    if (!latestPrediction || !latestPrediction.predictions?.length) {
      return res.status(404).json({ error: "No predictions found" });
    }

    const maxAQIs = latestPrediction.predictions.map((p) => p.max_aqi).filter(Boolean);
    const gsf = maxAQIs.reduce((sum, val) => sum + val, 0) / maxAQIs.length;

    const greenArea = (gsf * totalArea) / FACTOR;

    return res.status(200).json({
      gsf: gsf.toFixed(2),
      factor: FACTOR,
      totalArea,
      greenArea: greenArea.toFixed(2),
      unit: "sq meters" // or acres/km² as appropriate
    });
  } catch (err) {
    console.error("Error in green area calculation:", err.message);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};
//---------------------------------------------------------------------------------------------------------------

