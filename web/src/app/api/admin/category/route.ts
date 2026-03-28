import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import CategoryModel from "@/models/category.model";
import { auth } from "@/auth";

// GET all categories
export async function GET() {
  try {
    const session = await auth();
    if (!session || !["admin", "dummy_admin"].includes(session?.user?.role!)) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await ConnectDb();
    const categories = await CategoryModel.find({})
    // .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST create new category
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    // Only real admins can modify data
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Modifying data is limited to Admins only." },
        { status: 403 }
      );
    }

    await ConnectDb();
    const body = await req.json();
    const { title, slug } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, message: "Title and slug are required." }, { status: 400 });
    }

    // Check if category exists
    const existingCategory = await CategoryModel.findOne({ $or: [{ title }, { slug }] });
    if (existingCategory) {
      return NextResponse.json({ success: false, message: "Category with this title or slug already exists." }, { status: 400 });
    }

    const newCategory = await CategoryModel.create({
      title,
      slug
    });

    return NextResponse.json(
      { success: true, message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
