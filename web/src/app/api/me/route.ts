import { auth } from "@/auth";
import dbConnect from "@/config/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        await dbConnect()
        const session = await auth()
        if(!session || !session.user){
                return NextResponse.json({message:"user is not authenticated"},{status:400})
        }  
        const user =  await User.findOne({email:session.user.email}).select("-password") 
        if(!user){
            return NextResponse.json({success:false,message:"user not found"},{status:404})
        }  
            return NextResponse.json({success:true,user},{status:200})

    } catch (error) {
            return NextResponse.json({message:`get me error ${error}`},{status:500})
        
    }
}