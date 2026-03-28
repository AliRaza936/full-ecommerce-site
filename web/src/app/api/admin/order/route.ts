import { NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import Order from "@/models/order.model";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session: any = await auth();
    const validRoles = ["admin", "dummy_admin"];
    if (!session || !validRoles.includes(session.user?.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized: Admins only" }, { status: 401 });
    }

    await ConnectDb();
    
    // Populate user info for admin dashboard
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session: any = await auth();
    const validRoles = ["admin", "dummy_admin"];
    if (!session || !validRoles.includes(session.user?.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized: Admins only" }, { status: 401 });
    }

    await ConnectDb();
    
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: "Order ID and status are required" }, { status: 400 });
    }

    const validStatuses = ["pending", "shipped", "delivered", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
