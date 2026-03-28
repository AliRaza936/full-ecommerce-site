import { NextResponse } from "next/server";
import { auth } from "@/auth";
import ConnectDb from "@/config/db";
import User from "@/models/user.model";
import uploadOnCloudunary from "@/config/cloudinary";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    await ConnectDb();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const mobile = formData.get("mobile") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json({ message: "Name is required", success: false }, { status: 400 });
    }

    const updates: any = { name };
    if (mobile) updates.mobile = mobile;

    if (imageFile && imageFile.size > 0) {
      const uploadedImageUrl = await uploadOnCloudunary(imageFile);
      if (uploadedImageUrl) {
        updates.image = uploadedImageUrl;
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
}
