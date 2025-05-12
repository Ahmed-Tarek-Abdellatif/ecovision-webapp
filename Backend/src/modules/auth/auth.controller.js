import { Router } from "express";
import * as authService from "./auth.service.js"
import { asyncHandler } from "../../utils/errors/asynchandler.js";
import *as authSchemas from "./authSchema.js"
import { isValid } from "../../middleware/validation.middelware.js";
import { isauth } from "../../middleware/authentication.middleware.js";
const router=Router();

router.post("/register",asyncHandler(authService.register))
router.post("/login",authService.login)
router.get("/activate-account/:token",authService.activateAccount)
router.post("/refreshToken",isValid(authSchemas.refreshToken),asyncHandler(authService.refreshTok))
router.post("/verify",isValid(authSchemas.sendOtp),asyncHandler(authService.sendOtp))
router.post("/forget",isValid(authSchemas.forgetpass),asyncHandler(authService.forgetpass))
router.post("/reset",isValid(authSchemas.reset),asyncHandler(authService.reset))
router.post("/google-login",isValid(authSchemas.googleLogin),asyncHandler(authService.googleLogin))


export default router;