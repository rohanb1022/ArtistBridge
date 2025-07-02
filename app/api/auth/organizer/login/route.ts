import { generateToken } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json("All fields are required", { status: 400 });
  }

  const organizer = await prisma.organizer.findUnique({ where: { email } });
  if (!organizer) {
    return NextResponse.json("User does not exist", { status: 400 });
  }

  const isMatch = await bcrypt.compare(password, organizer.password);
  if (!isMatch) {
    return NextResponse.json("Email or password does not match", { status: 401 });
  }

  const token = generateToken({ id: organizer.id.toString(), role: "organizer" });

  const response = NextResponse.json({
    message: "Login successful",
    user: {
      id: organizer.id,
      name: organizer.name,
      email: organizer.email,
    },
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
