import { Router } from "express";
import *as userService from "./user.service.js"
import { isauth } from "../../middleware/authentication.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import { fileUpload, fileValidation } from "../../utils/file upload/multer.js";
import { cloudUpload } from "../../utils/file upload/multer cloud.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { roles } from "../../db/models/user.model.js";

const router= Router();

router.get("/profile",isauth,userService.getprofile)
router.delete("/freeze",isauth,asyncHandler(userService.freezeAcc))
router.put("/update",isauth,asyncHandler(userService.updateUser))
//upload profile picture
router.post("/profile-pic",
    isauth,
    fileUpload(fileValidation.images,"uploads/user").single("image"),//req.file
    asyncHandler(userService.uploadPic))
//upload profile pic in cloudenira
router.post(
    "/cloud_up",
    isauth,
    cloudUpload(fileValidation.images).single("image"), 
    asyncHandler(userService.uploadprofilecl),

)

router.post("/cover-pic",isauth,fileUpload(fileValidation.images).array("images",30),asyncHandler(userService.uploadCoverPic))
//req.files

//upload cv and licence
router.post('/multiFiles',
    isauth,
    fileUpload([...fileValidation.images,...fileValidation.files])
    .fields([
    {name:"cv",maxCount:1},
    {name:"licence",maxCount:2}]),
    asyncHandler(userService.uploadMF))

router.delete("/profile-pic",isauth,asyncHandler(userService.deleteProfPic))    

//view profile 
router.get("/viewProfile",isauth,isAuthorized(roles.USER),asyncHandler(userService.viewProfile))

//enable2FA
router.get("/enable2FA",isauth,asyncHandler(userService.enable2FA))
router.get("/2stepVer",isauth,asyncHandler(userService.verify2FA))

//block user
router.get("/block",isauth,asyncHandler(userService.blockUser))

export default router;
