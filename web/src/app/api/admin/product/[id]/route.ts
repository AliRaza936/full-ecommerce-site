import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import ProductModel from "@/models/product.model";
import CategoryModel from "@/models/category.model";
import { auth } from "@/auth";
import { uploadOnCloudunary, deleteFromCloudinary } from "@/config/productCloudinary";

// GET single product
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["admin", "dummy_admin"].includes(session?.user?.role!)) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const { id: productId } = await context.params;
    await ConnectDb();
    const product = await ProductModel.findById(productId);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT update product
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Modifying data is limited to Admins only." },
        { status: 403 }
      );
    }

    await ConnectDb();
    const { id: productId } = await context.params;
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const categoryId = formData.get("category") as string;
    const stock = Number(formData.get("stock"));

    // Existing images to keep
    const existingImagesStr = formData.get("existingImages") as string;
    let existingImages: string[] = [];
    if (existingImagesStr) {
      try {
        existingImages = JSON.parse(existingImagesStr);
      } catch {
        existingImages = formData.getAll("existingImages") as string[];
      }
    }

    // Images marked for deletion
    const deletedImagesStr = formData.get("deletedImages") as string;
    let deletedImages: string[] = [];
    if (deletedImagesStr) {
      try {
        deletedImages = JSON.parse(deletedImagesStr);
      } catch {
        deletedImages = formData.getAll("deletedImages") as string[];
      }
    }

    // New image files
    const newImagesForm = formData.getAll("newImages") as Blob[];

    if (existingImages.length + newImagesForm.length > 6) {
      return NextResponse.json({ success: false, message: "Maximum 6 images allowed combined." }, { status: 400 });
    }
    if (existingImages.length + newImagesForm.length === 0) {
      return NextResponse.json({ success: false, message: "At least one image is required." }, { status: 400 });
    }

    // Lookup category
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return NextResponse.json({ success: false, message: "Selected category not found." }, { status: 400 });
    }

    // Delete removed images from Cloudinary
    if (deletedImages.length > 0) {
      await Promise.all(deletedImages.map(url => deleteFromCloudinary(url)));
    }

    // Upload new images to Cloudinary
    let newlyUploadedUrls: string[] = [];
    if (newImagesForm.length > 0) {
      const uploadPromises = newImagesForm.map((img) => uploadOnCloudunary(img));
      const imageUrls = await Promise.all(uploadPromises);
      newlyUploadedUrls = imageUrls.filter(url => url !== null) as string[];
    }

    const finalImageUrls = [...existingImages, ...newlyUploadedUrls];

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        catName: category.title,
        catSlug: category.slug,
        stock,
        images: finalImageUrls
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Modifying data is limited to Admins only." },
        { status: 403 }
      );
    }

    const { id: productId } = await context.params;
    await ConnectDb();

    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(product.images.map(url => deleteFromCloudinary(url)));
    }

    await ProductModel.findByIdAndDelete(productId);

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Product deletion error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
