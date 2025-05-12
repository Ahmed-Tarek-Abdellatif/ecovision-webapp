import fs from "fs";
import path from "path";
export const globalError=(error,req,res,next)=>{
    if(req.file?.path){
        const fullpath=path.resolve(req.file.path)
        fs.unlinkSync(fullpath);
    }
    return res
    .status(error.cause||500)//status from 100 to 999
    .json({
        success:false,
        message:error.message,
        stack:error.stack,
    })
}