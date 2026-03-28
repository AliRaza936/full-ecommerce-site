import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import ProductModel from "@/models/product.model";
import OfferModel from "@/models/offer.model";

export async function GET(
  req: NextRequest,
 context: { params:Promise<{id:string}> }
) {
  try {
    await ConnectDb();
    const params = await context.params;
    const product = await ProductModel.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Check for active offer
    const now = new Date();
    const activeOffer = await OfferModel.findOne({
      products: params.id,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    return NextResponse.json({ success: true, product, offer: activeOffer }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
