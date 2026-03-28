import { NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session: any = await auth();
    const validRoles = ["admin", "dummy_admin"];
    
    if (!session || !validRoles.includes(session.user?.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await ConnectDb();

    // 1. Total Revenue (Completed/Delivered/Shipped orders)
    const revenueData = await Order.aggregate([
      { 
        $match: { 
          status: { $in: ["shipped", "delivered", "completed"] } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$totalAmount" } 
        } 
      }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 2. Counts
    const [totalOrders, totalProducts, totalUsers] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    // 3. Recent Orders (Top 5)
    const recentOrders = await Order.find()
      .populate("userId", "name email image")
      .sort({ createdAt: -1 })
      .limit(5);

    // 4. Products for "Top Selling" (In a real app this would use order items aggregation)
    // For now, let's just return 5 products
    const topProducts = await Product.find().limit(5);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
      },
      recentOrders,
      topProducts
    });

  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
