import { Router } from "express";


import { isauth } from "../../middleware/authentication.middleware.js";
import { fileUpload } from "../../utils/file upload/multer.js";
import { uploadAndPredict } from "./predict.service.js";


const router = Router();

// Use generic 'files' validation since we're uploading a CSV
const upload = fileUpload(["text/csv", "application/vnd.ms-excel"], "uploads");

router.post("/upload", isauth, upload.single("file"), uploadAndPredict);

export default router;
