/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateToken } from "@/lib/auth/auth";
import { setAuthCookie } from "@/lib/auth/cookie"; //  Import cookie util
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    
    const data = await req.json();
    const { name, email, password } = data;
    
    // Step 1: Validate inputs
    if (!name || !email || !password) {
      return new Response("Please mention all details", { status: 400 });
    }
    
    // Step 2: Check if org already exists
    const existingOrg = await prisma.organizer.findUnique({
      where: { email }, //  Your original code had: { email } directly, that’s invalid
    });
    
    if (existingOrg) {
      return new Response("Organisation already exists, please try to login", {
        status: 400,
      });
    }
    
    // Step 3: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Step 4: Create organizer in DB
    const newOrg = await prisma.organizer.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    //  Step 5: Generate JWT token
    const token = generateToken({ id: newOrg.id, role: "organizer" });
    
    // Step 6: Set token inside secure HTTP-only cookie
    setAuthCookie(token); // uses Next.js cookies() from server environment
    
    //  Step 7: Return success without exposing token
    const { password: _, ...organizerWithoutPassword } = newOrg;
    return Response.json({
      message: "Signup successful",
      user: organizerWithoutPassword,
    });
  } catch (error ) {
    return Response.json({message : error } , { status : 500 } )
  }
}
