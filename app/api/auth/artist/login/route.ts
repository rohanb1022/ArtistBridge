/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth/auth";
import { setAuthCookie } from "@/lib/auth/cookie";

export async function POST(req: Request) {
  const data = await req.json();
  const { email, password } = data;

  // Step 1: Validate inputs
  if (!email || !password) {
    return Response.json("All fields are required", { status: 400 });
  }

  // Step 2: Check if org exists
  const artist = await prisma.artist.findUnique({
    where: { email },
  });

  if (!artist) {
    return Response.json("artist not found", { status: 404 });
  }

  // Step 3: Compare password
  const isPasswordCorrect = await bcrypt.compare(password, artist.password);
  if (!isPasswordCorrect) {
    return Response.json("Invalid credentials", { status: 401 });
  }

  // Step 4: Generate JWT & set cookie
  const token = generateToken({ id: artist.id, role: "artist" });
  setAuthCookie(token); // This is the only new line

  // Step 5: Return safe response
  const { password: _, ...artistWithoutPassword } = artist;
  return Response.json({
    message: "Login successful",
    user: artistWithoutPassword,
  });
}
