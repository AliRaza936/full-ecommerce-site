import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import CategoryModel from "@/models/category.model";
import { auth } from "@/auth";

export async function PUT(req: NextRequest, context: { params:Promise<{id:string}> }) {
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
    const {id:categoryId} =await context.params;

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { title, slug },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ success: false, message: "Category not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Category updated successfully", category: updatedCategory },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params:Promise<{id:string}> }) {
  try {
    const session = await auth();
    // Only real admins can delete data
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Deleting data is limited to Admins only." },
        { status: 403 }
      );
    }

    await ConnectDb();
      const {id:categoryId} =await context.params;

    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return NextResponse.json({ success: false, message: "Category not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Category deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
