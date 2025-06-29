/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateToken } from "@/lib/auth/auth";
import { setAuthCookie } from "@/lib/auth/cookie";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req : Request){
    const body = await req.json()
    const { email , password } = body

    if ( !email || !password ) {
        return Response.json("All fields are required" , { status : 400 })
    }

    const organizer = await prisma.organizer.findUnique({where : { email }})
    if ( !organizer ) { 
        return Response.json("User does not exist" , {status : 400})
    }

    const isMatch = await bcrypt.compare(password , organizer.password)
    if ( !isMatch ) {
        return Response.json("email or password does not match" , { status : 401 })
    }

    const token = generateToken({ id : organizer.id , role : "organizer" })

    setAuthCookie(token); //  This is the only new line
    
     const { password: _, ...organizerWithoutPassword } = organizer;
  return Response.json({
    message: "Login successful",
    user: organizerWithoutPassword,
  });

}