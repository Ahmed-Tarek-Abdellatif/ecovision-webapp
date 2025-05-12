export const notFound=(req,res,next)=>{
        // return res.status(404).json({success:false,message:"invalid url"})
        return next(new Error("invalid url",{cause:404}))
    }