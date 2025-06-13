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
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("start_date", req.body.start_date || new Date().toISOString());

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
    console.error("WQI service error:", err.message);
    return res.status(500).json({ error: "Prediction failed", details: err.message });
  } finally {
    fs.unlink(filePath, () => {});
  }
};
