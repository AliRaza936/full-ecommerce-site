import { NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import CategoryModel from "@/models/category.model";

export async function GET() {
  try {
    await ConnectDb();
    const categories = await CategoryModel.find({}).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
