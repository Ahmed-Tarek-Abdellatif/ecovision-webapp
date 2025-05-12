import joi from "joi"


export const googleLogin=joi.object({
idToken:joi.string().required(),
}).required()

export let register=joi.object({
    userName:joi.string().max(20).required(),
    phone: joi.string().min(9).max(13).required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    cPassword:joi.string().valid(joi.ref("password")),
    otp:joi.string().min(5).max(15).required()
}).required();

export let login=joi.object({
    email:joi.string().email().required(),
    password:joi.string().required(),
}).required();


export const refreshToken=joi.object({
refreshToken:joi.string().required(),
}).required()


export const sendOtp=joi.object({
    email:joi.string().email().required(),
    }).required()


export const forgetpass=joi.object({
     email:joi.string().email().required()   
    }).required()


export const reset=joi.object({
        email:joi.string().email().required(), 
        otp:joi.string().required(),
        password:joi.string().required(),
        cPassword:joi.string().valid(joi.ref("password")),
       }).required()
   
