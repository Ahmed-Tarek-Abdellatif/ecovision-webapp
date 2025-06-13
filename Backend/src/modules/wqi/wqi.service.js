// services/wqi.service.js
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { WQIPrediction } from "../../db/models/wqi.model.js"; // Assume you have this

export const handleWQIUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required." });
  }

  const userId = req.userExist.id; // Assumes auth middleware populates req.user
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No user ID found." });
  }

  const filePath = req.file.path;
  // Log CSV file headers and shape for debugging
  try {
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const lines = csvContent.split(/\r?\n/).filter(Boolean);
    const headers = lines[0]?.split(',') || [];
    console.log("[WQI] Uploaded CSV headers:", headers);
    console.log(`[WQI] CSV row count (excluding header): ${lines.length - 1}`);
  } catch (csvErr) {
    console.warn("[WQI] Could not read/parse uploaded CSV for debug:", csvErr);
  }

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("start_date", req.body.start_date || new Date().toISOString());
  if (req.body.end_date) form.append("end_date", req.body.end_date);

  try {
    const response = await axios.post("http://localhost:8070/predict-wqi-smart", form, {
      headers: form.getHeaders(),
    });

    const results = response.data.results;

    // Save to MongoDB with user ID
    const saved = await WQIPrediction.create({
      user: userId,
      predictions: results,
      createdAt: new Date()
    });

    return res.status(200).json({
      message: "WQI Prediction successful",
      predictions: results,
      savedToDB: saved._id,
    });

  } catch (err) {
    // Improved error logging
    console.error("[WQI] Prediction error:", err);
    if (err.response) {
      // Axios error with response from FastAPI
      console.error("[WQI] FastAPI response data:", err.response.data);
      console.error("[WQI] FastAPI response status:", err.response.status);
      console.error("[WQI] FastAPI response headers:", err.response.headers);
    }
    // Return detailed error info to frontend for debugging
    return res.status(500).json({
      error: "Prediction failed",
      details: err.message,
      stack: err.stack,
      fastapi: err.response ? {
        data: err.response.data,
        status: err.response.status,
        headers: err.response.headers
      } : undefined
    });
  } finally {
    fs.unlink(filePath, () => {});
  }
};
