import { Router } from "express";
import { isauth } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { roles } from "../../db/models/user.model.js";
import { isValid } from "../../middleware/validation.middelware.js";
import { asyncHandler } from "../../utils/index.js";
import * as adminService from "./admin.service.js"
import { endPoint } from "./admin.endposints.js";
import { updateRole } from "./admin.Schema.js";
import { updateUser } from "../user/user.service.js";

const router=Router();
router.use(isauth,isAuthorized(...endPoint.adminDashboard));

router.get(
    "/data",
    asyncHandler(adminService.getData),
)
/**
 * update role
 * @url /admin/role
 * @body userId role
 */
router.patch("/role",isValid(updateRole),asyncHandler(adminService.updateRole))

export default router;
