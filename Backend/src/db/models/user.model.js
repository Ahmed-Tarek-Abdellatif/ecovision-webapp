import { hash } from "bcrypt";
import { Schema,Types,model } from "mongoose";
import { hashing } from "../../utils/hash/hash.js";

export const genders={
    Male:"male",
    M:"m",
    F:"f",
    FEMALE:"female"
};
Object.values(genders);//["male","female","m","f"]
Object.keys(genders);//["MALE","FEMALE",'M',"F"]

export const roles={
    USER:"user",
    ADMIN:"admin",
    SUPERADMIN:"superadmin",
    OWNER:"owner",
}
export const defaultsecure_url="https://res.cloudinary.com/djz35z4qn/image/upload/v1738842683/default_hizha6.jpg" ;
export const  defaultpublic_id="default_hizha6";
const userSchema=new Schema(
    {
        email:{type:String,required:[true,"email is required"],unique:[true,"email already exist"],lowercase:true},
        password:{type:String,required:function(){
            return this.provider=="system"?true:false;
        },
    },
        userName:{type:String,required:true,unique:[true,"userName already exist"]},
        phone:{type:String,
        required:function(){
            return this.provider=="system"?true:false;
        },
        unique:[true,"phone already"]},
        gender:{type:String,
            enum:Object.values(genders),
        },
        role:{type:String,enum:Object.values(roles),default:roles.USER},
        isDeleted:{type:Boolean,default:false},
        // profilePic:{type:String,default:"uploads/default.jpg"},
        profilePic:{secure_url:{type:String,default:defaultsecure_url,},
         public_id:{type:String,default: defaultpublic_id,}},

        isConfirmed:{type:Boolean,default:false},
        deletedAt:{type:Date},
        provider:{type:String,enum:["google","system"],default:"system"},
        coverPic:[String],
        updatedBy:{type:Types.ObjectId,ref:"User"},
    },
    {
        timestamps:true
    }

);

userSchema.pre("save", function(next){
//document middleware>>this >>document
if(this.isModified("password"))
this.password=hashing({data:this.password})
return next();

});
export const User=model("User",userSchema)