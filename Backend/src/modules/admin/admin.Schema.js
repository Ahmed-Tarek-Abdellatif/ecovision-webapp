import joi from "joi";
import { generalFields } from "../../middleware/validation.middelware.js";
import { roles } from "../../db/models/user.model.js";

export const updateRole=joi.object({
userId:generalFields.id.required(),
role:joi.string().valid(...Object.values(roles)).required(),
}).required()