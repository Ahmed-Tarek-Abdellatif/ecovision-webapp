import mongoose from "mongoose";

const aqiPredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  predictions: Object,
  createdAt: { type: Date, default: Date.now }
});

export const AQIPrediction = mongoose.model("AQIPrediction", aqiPredictionSchema);
