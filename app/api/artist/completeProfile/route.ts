/* eslint-disable @typescript-eslint/no-unused-vars */
import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";
export const runtime = "nodejs";



export async function PUT(req : Request) {

    // Checking whether the user is authorized or not
    const user = await withAuth(req);
    console.log("user" , user)
    if (!user || user.role !== "artist") return Response.json({message : "Unauthorized"} , {status : 401})

    const data = await req.json();
    const { category , bio , price ,bestEvent } = data;

    if ( !category || !bio || !price || !bestEvent){ 
        return Response.json({message : "Please provide all the fields once"} , {status : 400})
    }

    try {
        const updatedFields =  await prisma.artist.update({
            where : { id : user.id },
            data : {
                category,
                bio,
                price,
                bestEvent,
            },
        });

        const { password : _ , ...cleanData } = updatedFields;
        return Response.json({ message: "Profile updated", artist: cleanData }, { status: 200 });

    } catch (error) {
        console.log("error occured" + error)
        return Response.json({message : "Some error occurred"} , { status : 500 })
    }
    
}