/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req : Request){ 
    const data = await req.json();
    const { name , email , password , city  } = data

    if ( !name || !email || !password || !city  ) {
        return new Response(" Please mention all details" , {status : 400})
    }

    const existingOrg = await prisma.organizer.findUnique({ email }) 
    if ( existingOrg ) { 
        return new Response(" Organisation already exists , please try to login " , { status : 400 })
    }

    const hashedPassword = await bcrypt.hash(password , 10)

    const newOrg = await prisma.create({
        data : {
            name,
            email,
            password : hashedPassword,
            city
        },
    })

    const token = generateToken({ id :newOrg.id , role : "organizer" })
    const {password : _ , ...organizerWithoutPassword} = newOrg
    return Response.json({token ,  organizerWithoutPassword })
}