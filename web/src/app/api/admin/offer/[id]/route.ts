import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import OfferModel from "@/models/offer.model";
import { auth } from "@/auth";

// GET single offer
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["admin", "dummy_admin"].includes(session?.user?.role!)) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const { id } = await context.params;
    await ConnectDb();
    const offer = await OfferModel.findById(id).populate("products", "name price images stock");

    if (!offer) {
      return NextResponse.json({ success: false, message: "Offer not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, offer }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT update offer
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Only Admins can update offers." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
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

    const updatedOffer = await OfferModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        discountPercentage: discountPercentage ?? 0,
        isActive: isActive ?? true,
        products: products ?? [],
      },
      { new: true, runValidators: true }
    ).populate("products", "name price images stock");

    if (!updatedOffer) {
      return NextResponse.json({ success: false, message: "Offer not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Offer updated successfully", offer: updatedOffer },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Offer update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE offer
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Only Admins can delete offers." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    await ConnectDb();

    const offer = await OfferModel.findByIdAndDelete(id);

    if (!offer) {
      return NextResponse.json({ success: false, message: "Offer not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Offer deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Offer deletion error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
