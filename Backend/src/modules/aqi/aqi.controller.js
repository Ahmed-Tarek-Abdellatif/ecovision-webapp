import { Router } from "express";
import { isauth } from "../../middleware/authentication.middleware.js";
import { fileUpload } from "../../utils/file upload/multer.js";
import { uploadAndPredictAQI } from "./aqi.service.js";

const router = Router();
const upload = fileUpload(["text/csv", "application/vnd.ms-excel"], "uploads");

router.post("/upload-aqi", isauth, upload.single("file"), uploadAndPredictAQI);

export default router;