import { generateToken } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export const runtime = "nodejs"; 

export async function POST(req: Request) {
  const data = await req.json();
  const { name, email, password } = data;

  if (!name || !email || !password) {
    return NextResponse.json("Please mention all details", { status: 400 });
  }

  const existingOrg = await prisma.organizer.findUnique({ where: { email } });
  if (existingOrg) {
    return NextResponse.json("Organisation already exists", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newOrg = await prisma.organizer.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken({ id: newOrg.id.toString(), role: "organizer" });

  const response = NextResponse.json({
    message: "Signup successful",
    user: {
      id: newOrg.id,
      name: newOrg.name,
      email: newOrg.email,
    },
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
