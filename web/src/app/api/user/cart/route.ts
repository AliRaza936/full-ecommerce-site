import { NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import Cart from "@/models/cart.model";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await ConnectDb();
    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json({ success: true, cart: { items: [], totalAmount: 0 } });
    }

    return NextResponse.json({ success: true, cart });
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
    const { productId, name, image, price, qty } = await req.json();

    if (!productId || !name || !image || !price || !qty) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: session.user.id,
        items: [{ productId, name, image, price, qty }],
        totalAmount: price * qty,
      });
    } else {
      // Update existing cart
      const existingItemIndex = cart.items.findIndex((item: any) => item.productId.toString() === productId);

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].qty += qty;
      } else {
        cart.items.push({ productId, name, image, price, qty });
      }
      cart.totalAmount = cart.items.reduce((total: number, item: any) => total + item.price * item.qty, 0);
    }

    await cart.save();
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await ConnectDb();
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    cart.items = items;
    cart.totalAmount = cart.items.reduce((total: number, item: any) => total + item.price * item.qty, 0);
    await cart.save();

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await ConnectDb();
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    const clearAll = searchParams.get("all");

    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    if (clearAll === "true") {
      cart.items = [];
    } else if (itemId) {
      cart.items = cart.items.filter((item: any) => item.productId.toString() !== itemId);
    } else {
      return NextResponse.json({ success: false, message: "Invalid request parameters" }, { status: 400 });
    }

    cart.totalAmount = cart.items.reduce((total: number, item: any) => total + item.price * item.qty, 0);
    await cart.save();
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
