import multer, { diskStorage } from "multer"
import { nanoid } from "nanoid";
import fs, { existsSync } from "fs";
import path from "path";

export const fileValidation={
   images:["image/jpeg","image/png"],
   files:["application/pdf"],
   videos:["video/mp4"],
   audios:["audio/wav"],
}

export const fileUpload=(allowedFiles,folder)=>{
   const storage= diskStorage({
      destination:(req,file,cb)=>{
        const fullpath= path.resolve(`${folder}/${req.userExist._id}`)
        if(!fs.existsSync(fullpath))
        fs.mkdirSync(fullpath, { recursive: true });

   cb(null,fullpath)
   },//destination takes string or function
    filename:(req,file,cb)=>{
   console.log(file);
   cb(null,nanoid()+file.originalname);//act as next()
   },
});
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