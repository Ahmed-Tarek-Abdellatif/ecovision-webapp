import { Router } from "express";
import multer from "multer";
import { predictAQI } from "../aqi/aqi.controller.js";
import { isauth } from "../../middleware/authentication.middleware.js";
import { calculateGreenArea } from "./aqi.service.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/predict",isauth, upload.single("file"), predictAQI);


router.post("/calculate-green-area", isauth, calculateGreenArea);

export default router;
