import CryptoJS from "crypto-js"
export const decrypt =({data,key=process.env.CRYPTO_KEY})=>{
     return CryptoJS.AES.decrypt(data,key).toString(CryptoJS.enc.Utf8)
}