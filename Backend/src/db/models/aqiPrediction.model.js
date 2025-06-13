import mongoose from "mongoose";

const AQIPredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  predictions: { type: [Object], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const AQIPrediction = mongoose.model("AQIPrediction", AQIPredictionSchema);
 