import mongoose from "mongoose";//thied party
import chalk from "chalk";

async function connectDB(){
  await  mongoose
  .connect(process.env.DB_URL1)
  .then(()=>{
    console.log(chalk.greenBright("db connected successfully"));
  })
  .catch((error)=>{
    console.log("error connecting db",error.message);
  })
}
export default connectDB;