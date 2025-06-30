/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const { email, password } = data;

  // Step 1: Validate inputs
  if (!email || !password) {
    return NextResponse.json("All fields are required", { status: 400 });
  }

  // Step 2: Check if artist exists
  const artist = await prisma.artist.findUnique({
    where: { email },
  });

  if (!artist) {
    return NextResponse.json("artist not found", { status: 404 });
  }

  // Step 3: Compare password
  const isPasswordCorrect = await bcrypt.compare(password, artist.password);
  if (!isPasswordCorrect) {
    return NextResponse.json("Invalid credentials", { status: 401 });
  }

  // Step 4: Generate JWT Token
  const token = generateToken({ id: artist.id, role: "artist" });

  // Step 5: Set Cookie using NextResponse
  const response = NextResponse.json(
    {
      message: "Login successful",
      user: {
        id: artist.id,
        email: artist.email,
        name: artist.name,
      },
    },
    { status: 200 }
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
