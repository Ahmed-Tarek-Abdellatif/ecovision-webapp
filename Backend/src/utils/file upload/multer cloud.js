import multer, { diskStorage } from "multer"
import { nanoid } from "nanoid";
import fs, { existsSync } from "fs";
import path from "path";

export const fileValidation={
   images:["image/jpeg","image/png"],
   files: ["application/pdf", "text/csv"],
   videos:["video/mp4"],
   audios:["audio/wav"],
}

export const cloudUpload=(allowedFiles)=>{
   const storage= diskStorage({});//temp folder
const fileFilter=(req,file,cb)=>{
  
  if (!allowedFiles.includes(file.mimetype)){
   return cb(new Error("invalid extenstion")) 
}
return cb(null,true);
}
  return multer({storage,fileFilter});
}
 //>>>>>>>>>diskstorage is function
    //diskstorage({destination:string,filename:function})
    //>>>>>>>>>multer is function 
    //multer({storage: result of executing diskstorage})