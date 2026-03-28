import { NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please enter all fields" },
        { status: 400 }
      );
    }

    await ConnectDb();

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return NextResponse.json(
        { message: "User already registered" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      return NextResponse.json(
        { message: "User created successfully", success: true },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
