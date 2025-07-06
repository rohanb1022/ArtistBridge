import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/auth/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export const runtime = "nodejs"; 

export async function POST(req: Request) {
  const data = await req.json();
  const { email, password } = data;

  // Step 1: Validate inputs
  if (!email || !password) {
    console.error("Login Error: All fields are required"); // Add server-side logging
    return NextResponse.json("All fields are required", { status: 400 });
  }

  // Step 2: Check if artist exists
  const artist = await prisma.artist.findUnique({
    where: { email },
  });

  if (!artist) {
    console.error("Login Error: Artist not found for email:", email); // Add server-side logging
    return NextResponse.json("artist not found", { status: 404 });
  }

  // Step 3: Compare password
  const isPasswordCorrect = await bcrypt.compare(password, artist.password);
  if (!isPasswordCorrect) {
    console.error("Login Error: Invalid credentials for email:", email); // Add server-side logging
    return NextResponse.json("Invalid credentials", { status: 401 });
  }

  // Step 4: Generate JWT Token
  const token = generateToken({ id: artist.id.toString(), role: "artist" });
  console.log("Login Success: Token generated for artist:", artist.email); // Add server-side logging

  // Step 5: Set Cookie using NextResponse
  const response = NextResponse.json(
    {
      message: "Login successful",
      user: {
        id: artist.id,
        email: artist.email,
        name: artist.name, // Ensure 'name' exists on artist object
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
// Add server-side logging
  return response; // <--- ENSURE THIS RETURN IS REACHED AND EXECUTED
}