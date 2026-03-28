import { NextRequest, NextResponse } from "next/server";

import ReviewModel from "@/models/review.model";

import ConnectDb from "@/config/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const newReview = await ReviewModel.create({
      productId,
      userName: session.user.name,
      userEmail: session.user.email,
      userImage: session.user.image || "",
      rating,
      comment,
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating review", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await ConnectDb();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ success: false, message: "ProductId is required" }, { status: 400 });
    }

    const reviews = await ReviewModel.find({ productId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching reviews", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
