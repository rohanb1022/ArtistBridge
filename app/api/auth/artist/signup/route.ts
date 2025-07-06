import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
export const runtime = "nodejs"; 

export async function POST(req: Request) {
  const data = await req.json();
  const { name, email, password , city} = data;

  // Step 1: Validate inputs
  if (!name || !email || !password || !city) {
    return NextResponse.json("All fields are required", { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json("Password must be at least 6 characters", { status: 400 });
  }

  // Step 2: Check if artist already exists
  const existingArtist = await prisma.artist.findUnique({
    where: { email },
  });

  if (existingArtist) {
    return NextResponse.json("Artist already exists", { status: 400 });
  }

  // Step 3: Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 4: Create new artist
  const newArtist = await prisma.artist.create({
    data: {
      name,
      email,
      password: hashedPassword,
      city,
    },
  });

  // Step 5: Generate JWT and set cookie
  const token = generateToken({ id: newArtist.id.toString(), role: "artist" });

  const response = NextResponse.json({
    message: "Signup successful",
    user: {
      id: newArtist.id,
      name: newArtist.name,
      email: newArtist.email,
      city: newArtist.city,
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
