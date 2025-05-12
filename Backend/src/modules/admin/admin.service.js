import { roles, User } from "../../db/models/user.model.js"



export const updateRole=async(req,res,next)=>{
    const{userId,role}=req.body;
    //check heirarchy
    const targetUser=await User.findById(userId).select("role");
    
    const targetUserRole=targetUser.role;
    const userRole=req.userExist.role;

    const rolesHeirarchy=Object.values(roles);//[usre,admin,superadmin,owner]
//find index
 const userRoleIndex=rolesHeirarchy.indexOf(userRole)
 const targetUserIndex=rolesHeirarchy.indexOf(targetUserRole)
 const updatedRoleIndex=rolesHeirarchy.indexOf(role)
 if(userRoleIndex<=targetUserIndex)
    return next(new Error("not allowed!",{cause:401}))

 if(userRoleIndex<updatedRoleIndex) 
    return next(new Error("not allowed!",{cause:401}))

 const userUpdated=await User.findByIdAndUpdate(
    userId,{
    role,
    updatedBy:req.userExist._id
},{new:true})
 return res.status(200).json({success:true,data:userUpdated})
}
