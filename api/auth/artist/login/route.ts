import { generateToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function POST(req : Request) {
    const data = await req.json();
    const { email , password } = data

    if ( !email || !password ) {
        return Response.json(" Please mention all the details " , { status : 400 })
    }

    const user = await prisma.artist.findUnique({where : { email }})
    if ( !user ) {
        return Response.json("User does not exist" , { status : 400 } )
    }

    const isMatch = await bcrypt.compare(password , user.password)
    if ( !isMatch ) {
        return Response.json("Password or email is incorrect" , { status : 401 })
    }

    const token = generateToken({id : user.id , role : "artist" })

    return Response.json({
       message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
    
}