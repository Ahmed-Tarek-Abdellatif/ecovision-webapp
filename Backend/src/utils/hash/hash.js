import bcrypt from "bcrypt"
export const hashing=({data,saltRound=8})=>{

    return bcrypt.hashSync(data,saltRound)
}