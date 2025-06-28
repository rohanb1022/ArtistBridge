/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth"

const prisma = new PrismaClient();


export async function POST(req : Request){
    const data = await req.json();
    const { name , password , email , city } = data;

    if ( !name || !password || !email || !city ) {
        return Response.json("Required all fields" , {status : 400})
    }
    
    const existtingArtist = await prisma.Artist.findUnique({ where : { email } })
    if(existtingArtist) {
        return Response.json("Artist already exist , please try to login" , { status : 400 })
    }

    const hashedPassword = await bcrypt.hash(password , 8)

    
    const newArtist = await prisma.artist.create({
        data : {
            name,
            password : hashedPassword,
            email,
            city,
        },
    })
    const token = generateToken({ id : newArtist.id , role : "artist" })
    const { password: _ , ...artistWithoutPassword } = newArtist;
    return Response.json({token , artistWithoutPassword})
}