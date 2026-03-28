import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import OfferModel from "@/models/offer.model";
import { auth } from "@/auth";

// GET all offers
export async function GET() {
  try {
    const session = await auth();
    if (!session || !["admin", "dummy_admin"].includes(session?.user?.role!)) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await ConnectDb();
    const offers = await OfferModel.find({})
      .populate("products", "name price images stock")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, offers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST create new offer
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Only Admins can create offers." },
        { status: 403 }
      );
    }

    await ConnectDb();
    const body = await req.json();
    const { title, description, startDate, endDate, discountPercentage, isActive, products } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: "Title, start date, and end date are required." },
        { status: 400 }
      );
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { success: false, message: "End date must be after start date." },
        { status: 400 }
      );
    }

    const newOffer = await OfferModel.create({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      discountPercentage: discountPercentage ?? 0,
      isActive: isActive ?? true,
      products: products ?? [],
    });

    return NextResponse.json(
      { success: true, message: "Offer created successfully", offer: newOffer },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Offer creation error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
