import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional
  filename: String,
  predictions: Object, // FastAPI response
  createdAt: { type: Date, default: Date.now }
});

export const Prediction = mongoose.model("Prediction", predictionSchema);
