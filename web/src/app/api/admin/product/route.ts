import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import ProductModel from "@/models/product.model";
import CategoryModel from "@/models/category.model";
import { auth } from "@/auth";
import { uploadOnCloudunary } from "@/config/productCloudinary";

// GET all products
export async function GET() {
  try {
    const session = await auth();
    if (!session || !["admin", "dummy_admin"].includes(session?.user?.role!)) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await ConnectDb();
    const products = await ProductModel.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST create new product
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Modifying data is limited to Admins only." },
        { status: 403 }
      );
    }

    await ConnectDb();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const categoryId = formData.get("category") as string;
    const stock = Number(formData.get("stock"));

    // Get all image files
    const imagesForm = formData.getAll("images") as Blob[];

    if (!name || !description || isNaN(price) || !categoryId || isNaN(stock)) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    if (imagesForm.length === 0) {
      return NextResponse.json({ success: false, message: "At least one image is required." }, { status: 400 });
    }

    if (imagesForm.length > 6) {
      return NextResponse.json({ success: false, message: "Maximum 6 images allowed." }, { status: 400 });
    }

    // Lookup category to get name and slug
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return NextResponse.json({ success: false, message: "Selected category not found." }, { status: 400 });
    }

    // Upload images to Cloudinary
    const uploadPromises = imagesForm.map((img) => uploadOnCloudunary(img));
    const imageUrls = await Promise.all(uploadPromises);
    const validImageUrls = imageUrls.filter(url => url !== null) as string[];

    if (validImageUrls.length === 0) {
      return NextResponse.json({ success: false, message: "Failed to upload images." }, { status: 500 });
    }

    const newProduct = await ProductModel.create({
      name,
      description,
      price,
      catName: category.title,
      catSlug: category.slug,
      stock,
      images: validImageUrls
    });

    return NextResponse.json(
      { success: true, message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
