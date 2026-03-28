import { NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import OfferModel from "@/models/offer.model";

export async function GET() {
  try {
    await ConnectDb();
    const now = new Date();
    
    // Find active offers where current date is within range
    const offers = await OfferModel.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
      .populate("products", "name price images stock")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, offers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
