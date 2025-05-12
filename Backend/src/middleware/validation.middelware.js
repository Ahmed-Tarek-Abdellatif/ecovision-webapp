import joi from "joi"
import { Types } from "mongoose";



export const isValid=(schema)=>{
    return(req,res,next)=>{
    
        let data={...req.body,...req.params,...req.query}
        if(req.file ||req.files) data.attachment=req.file ||req.files
        const result=schema.validate(data,{abortEarly:false});
      if(result.error){
        let messageArr=result.error.details.map((obj)=>obj.message)
        return next(new Error(messageArr,{cause:400}))
      }
      next();

    }

}

export const isValidId= (value,helper)=>{
        if(!Types.ObjectId.isValid(value))return helper.message("invalid id")
            return true;
    }


    export const generalFields={
     attachment: joi.object({
              fieldname:joi.string().required(),
              originalname:joi.string().required(),
              encoding:joi.string().required(), 
              mimetype:joi.string().required(),
              destination:joi.string().required(),
              filename:joi.string().required(),
              path:joi.string().required(),
              size:joi.number().required(),
          }),
          id:joi.custom(isValidId),
    }