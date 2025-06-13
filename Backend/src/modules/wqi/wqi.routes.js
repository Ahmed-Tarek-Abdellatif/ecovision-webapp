// routes/wqi.route.js
import { Router } from "express";
import multer from "multer";
import { predictWQI } from "../wqi/wqi.controller.js";
import { isauth } from "../../middleware/authentication.middleware.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/predict",isauth, upload.single("file"), predictWQI);

export default router;
