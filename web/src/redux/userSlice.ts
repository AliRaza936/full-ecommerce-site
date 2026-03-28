import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IUser{
    _id?:mongoose.Types.ObjectId
    name: string
    email: string
    password?: string
    mobile?: string
    role:"user" | "deliveryBoy" |"admin"
    image?:string

}
interface IUserSlice{
    userData: IUser | null
    loading: boolean

}
const initialState:IUserSlice ={
    userData:null,
     loading: true,
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
             state.loading = false
        },
         clearUser: (state) => {
      state.userData = null
      state.loading = false
    },
    
    }
})

export const {setUserData,clearUser} = userSlice.actions
export default userSlice.reducer