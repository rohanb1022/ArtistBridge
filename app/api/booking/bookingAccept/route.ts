import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";

export async function PUT(req : Request){
    const user = await withAuth(req)
    if ( !user || user.role !== "artist" ) {
        return Response.json({ message : "Unauthorized" } , {status : 401})
    }
    const data = await req.json();
    const { updatedStatus , requestId} = data;
    try {
        const artist = await prisma.artist.findUnique({where : {id : user.id}})
        if ( !artist){
            return Response.json({ message : "Artist not found" } , {status : 400})
        }

        if (!requestId) {
            return Response.json({message : "Request id is not mentioned"} , {status : 404})
        }

        const bookingRequest = await prisma.booking.findUnique({where : { id : requestId}})
        if (!bookingRequest || bookingRequest.status !== "PENDING") {
            return Response.json({ message : "Request is not valid" } , { status : 404 })
        }

        const updatedRequest = await prisma.booking.update({
            where : { id : requestId},
            data : {
                status : updatedStatus,
            } 
        })

        return Response.json({ message : "Update successfully" , updatedRequest } , {status : 200} )
    } catch (error) {
        return Response.json({ message : "Internal error at accepting req funtction" , error} , {status : 500} )
    }
}