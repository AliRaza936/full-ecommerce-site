import { NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import Order from "@/models/order.model";
import Cart from "@/models/cart.model";
import ProductModel from "@/models/product.model";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await ConnectDb();
    const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await ConnectDb();
    const { shippingInfo } = await req.json();

    if (!shippingInfo || !shippingInfo.name || !shippingInfo.email || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.postalCode || !shippingInfo.country) {
      return NextResponse.json({ success: false, message: "Complete shipping info is required" }, { status: 400 });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    // Create order
    const order = await Order.create({
      userId: session.user.id,
      items: cart.items,
      totalAmount: cart.totalAmount,
      shippingInfo,
      status: "pending",
    });

    // Successfully created order, now decrease product stock
    for (const item of cart.items) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty }
      });
    }

    // Clear cart after order is placed
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
