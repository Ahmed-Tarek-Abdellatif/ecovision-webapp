import { User } from "../db/models/user.model.js";
import jwt from "jsonwebtoken"
import { messages } from "../utils/messages/index.js";
import { verifyToken } from "../utils/index.js";

export const isauth=async(req,res,next)=>{
try {
    const {authorization}=req.headers;
if(!authorization)
 return res.status(400).json({message:"required  token"})
if(!authorization.startsWith("Bearer"))
 return res.status(500).json({message:"invalid Bearer"});
  const token = authorization.split(" ")[1];
    if (!token) {
        return res.status(400).json({ message: "JWT must be provided" });
      }
      
    const result=verifyToken({token});
    if(result.error) return next(result.error)
    // console.log(id)
    //return payload or throw error
  //check user existance
  const userExist= await User.findById(result.id);
  if(!userExist){
      return res.status(404).json({message:messages.user.notFound})
  }


  if(userExist.isDeleted==true) return next(new Error("login first",{cause:400}));

  // if(userExist.deletedAt.getTime()>iat*1000) return next(new Error("invalid token",{cause:400})) 
  if (userExist.isDeleted && userExist.deletedAt && userExist.deletedAt.getTime() > result.iat * 1000) {
    return next(new Error("Invalid token", { cause: 400 }));
  }
  


//pass data of user to req
req.userExist=userExist;


return next();



} catch (error) {
    return res.status(400).json({message:error.message })
}
}