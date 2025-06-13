// db/models/wqiPrediction.model.js
import mongoose from "mongoose";

const WQIPredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  predictions: { type: [Object], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const WQIPrediction = mongoose.model("WQIPrediction", WQIPredictionSchema);
