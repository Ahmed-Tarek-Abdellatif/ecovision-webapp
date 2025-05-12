import { roles } from "../../db/models/user.model.js";

export const endPoint={
    adminDashboard:[roles.ADMIN,roles.SUPERADMIN,roles.OWNER]
    
}