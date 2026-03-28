import mongoose from "mongoose";

export interface IUser{
    _id?:mongoose.Types.ObjectId
    name: string
    email: string
    password?: string
    mobile?: string
    role:"user" |"admin"
    image?:string


}
let userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    mobile: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    image: {
        type: String,
    },
   

   
},{timestamps:true});


const User = mongoose.models.User || mongoose.model("User",userSchema)
export default User