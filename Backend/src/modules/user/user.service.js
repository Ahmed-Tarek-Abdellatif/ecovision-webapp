import jwt from "jsonwebtoken"
import { User } from "../../db/models/user.model.js";
import CryptoJS from "crypto-js";
import { decrypt } from "../../utils/crypto/decrypt.js";
import { messages } from "../../utils/messages/index.js";
import fs from "fs"
import path from "path";
import cloudinary from "../../utils/file upload/cloudinary.config.js";
import nodemailer from "nodemailer";
export const getprofile=async (req,res,next)=>{
  try {
      const userExist=req.user;
      userExist.phone=decrypt({data:userExist.phone})
    return res.status(200).json({success:true,data:userExist})
  
  } catch (error) {
    return res.status(500).json({success:false,error:error.message,message:"ond"})
  }

}

export const freezeAcc=async (req,res,next)=>{
await User.updateOne({_id:req.userExist._id},{isDeleted:true,deletedAt:Date.now()})
return res.status(200).json({success:true,message:"user deleted successfully "})

};
export const updateUser=async (req,res,next)=>{
  const {userName,email}=req.body
  const user= await User.findById(req.userExist._id)
  if(!user) return next(new Error(messages.user.notFound,{cause:404}))
  user.userName=userName;
  user.email=email;
 await  user.save();
 return res.status(200).json({success:true,message:"user updated successfully"})
}
export const uploadPic=async(req,res,next)=>{
  
  if (req.userExist.profilePicture) {
    // Get the path of the old profile picture
    const oldPicPath = path.resolve(req.userExist.profilePicture);
    // Check if the file exists and delete it
      if (fs.existsSync(oldPicPath)) {
        fs.unlinkSync(oldPicPath);  // Synchronously delete the old file
       
      }
    }
const user= await User.findByIdAndUpdate(req.userExist._id,
  {profilePicture:req.file.path},{new:true});
  return res.status(200).json({success:true,data:user})
}
export const uploadCoverPic=async(req,res,next)=>{
  let coverPic=[];
  req.files.forEach((file) => {
    return coverPic.push(file.path);
  });
  const user=await User.findByIdAndUpdate(req.userExist._id,{coverPic},{new:true})
  return res.status(200).json({success:true,data:user})
}
export const uploadMF=async(req,res,next)=>{
  

  return res.status(200).json({files:req.files})
}

export const deleteProfPic=async(req,res,next)=>{
//delete prof pic from fs

if( req.userExist.profilePic !="uploads/default.jpg"){

const fullpath=path.resolve(req.userExist.profilePicture)
fs.unlinkSync(fullpath)
// delete prof pic from db
await User.updateOne({_id:req.userExist._id},{profilePicture:"uploads/default.jpg"})
}
return res.status(200).json({success:true,message:"img deleted successfully"})
}


export const uploadprofilecl=async(req,res,next)=>{

  //delete old prof pic
 await cloudinary.uploader.destroy(req.userExist.profilePic.public_id)

const {secure_url,public_id}=  await cloudinary.uploader.upload(req.file.path,{
  folder:`social-app/users/${req.userExist._id}/profile-pic`,
})

const user= await User.findByIdAndUpdate(req.userExist._id,{profilePic:{secure_url,public_id}})
return res.status(200).json({success:true,data:user})

};

export const viewProfile = async (req, res, next) => {
  
    const viewer = req.userExist;  // Logged-in user viewing another profile
    const targetUserId = req.params.id; // Target user profile being viewed

    if (viewer._id.toString() === targetUserId) {
      // Don't track views for the user viewing their own profile
      return res.status(200).json({ success: true, message: "Profile viewed" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return next(new Error("User not found", { cause: 404 }));

    // Record the view attempt with the current date
    const viewAttempt = new Date().toISOString();

    // Update the viewAttempts array
    targetUser.viewAttempts.push(viewAttempt);

    // If there are more than 5 attempts, remove the first one (oldest)
    if (targetUser.viewAttempts.length > 5) {
      targetUser.viewAttempts.shift();
    }

    // Save the updated user data
    await targetUser.save();

    // If the user has been viewed 6 times, send an email notification
    if (targetUser.viewAttempts.length === 5) {
      const viewDates = targetUser.viewAttempts.join(", ");
      

      // Send activation email
        const isSent = await sendemail({
            to: email,
            subject: `Verify your account, dear ${email}`,
            html: `<p>To verify your account, please click <a href="${link}">here</a></p>`,
        });
    
        if (!isSent) return next(new Error("Email not sent. Please try again.", { cause: 500 }));
      }
      }

      export const enable2FA = async (req, res, next) => {
       
          const user = req.userExist;
          const otp = OTPService.generateOTP(); // Assuming you have an OTPService to generate OTP
      
          user.otp = otp;
          await user.save();
      
          // Send OTP to user email
           // Send activation email
    const isSent = await sendemail({
      to: email,
      subject: `Verify your account, dear ${email}`,
      html: `<p>To verify your account, please click <a href="${link}">here</a></p>`,
  });

  if (!isSent) return next(new Error("Email not sent. Please try again.", { cause: 500 }));
}
      
      
      // Verify OTP and enable 2-Step Verification
      export const verify2FA = async (req, res, next) => {
        try {
          const { otp } = req.body;
          const user = req.userExist;
      
          if (user.otp !== otp) {
            return next(new Error("Invalid OTP", { cause: 400 }));
          }
      
          user.is2FAEnabled = true;
          await user.save();
          return res.status(200).json({ success: true, message: "2-Step Verification enabled successfully" });
        } catch (error) {
          return res.status(500).json({ success: false, error: error.message });
        }
      };
      
      // Login with 2-Step Verification
      export const loginWith2FA = async (req, res, next) => {
        try {
          const { email, password, otp } = req.body;
          const user = await User.findOne({ email });
      
          if (!user || !user.is2FAEnabled) {
            // Normal login without OTP for users without 2FA
            // Validate password and send tokens
            return res.status(200).json({ success: true, message: "Login successful" });
          }
      
          // Validate OTP for users with 2FA enabled
          if (user.otp !== otp) {
            return next(new Error("Invalid OTP", { cause: 400 }));
          }
      
          // After OTP is verified, generate tokens
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
          return res.status(200).json({ success: true, token });
        } catch (error) {
          return res.status(500).json({ success: false, error: error.message });
        }
      };

      export const blockUser = async (req, res, next) => {
        try {
          const targetEmail = req.body.email;
          const user = req.userExist;
      
          const targetUser = await User.findOne({ email: targetEmail });
          if (!targetUser) {
            return next(new Error("User not found", { cause: 404 }));
          }
      
          // Add target user to blocked list
          if (!user.blockedUsers) {
            user.blockedUsers = [];
          }
      
          user.blockedUsers.push(targetUser._id);
          await user.save();
      
          return res.status(200).json({ success: true, message: "User blocked successfully" });
        } catch (error) {
          return res.status(500).json({ success: false, error: error.message });
        }
      };
      