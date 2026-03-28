import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import ProductModel from "@/models/product.model";

export async function GET(req: NextRequest) {
  try {
    await ConnectDb();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query: any = {};

    if (category) {
      query.catSlug = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await ProductModel.find(query).sort({ createdAt:1 });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
