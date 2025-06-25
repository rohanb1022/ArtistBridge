import { generateToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

export async function POST(req : Request){
    const body = await req.json()
    const { email , password } = body

    if ( !email || !password ) {
        return Response.json("All fields are required" , { status : 400 })
    }

    const user = await prisma.organizer.findUnique({where : { email }})
    if ( !user ) { 
        return Response.json("User does not exist" , {status : 400})
    }

    const isMatch = await bcrypt.compare(password , user.password)
    if ( !isMatch ) {
        return Response.json("email or password does not match" , { status : 401 })
    }

    const token = generateToken({ id : user.id , role : "organizer" })

    return Response.json({
        message : "User logged in successfully",
        token,
        data : { 
            name  : user.name,
            email : email,
            role : "organizer"
        }
    })

}