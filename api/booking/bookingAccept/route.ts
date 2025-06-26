import { withAuth } from "@/lib/middleware";
import { PrismaClient } from "@prisma/client";

const prisma = PrismaClient();

export async function PUT(req : Request){
    const user = await withAuth(req)
    if ( !user || user.role !== "artist" ) {
        return Response.json({ message : "Unauthorized" } , {status : 401})
    }
    const data = await req.json();
    const { updatedStatus } = data;
    try {
        const artist = await prisma.artist.findUnique({where : {id : user.id}})
        if ( !artist){
            return Response.json({ message : "Artist not found" } , {status : 400})
        }

        const { requestId } = data
        if (!requestId) {
            return Response.json({message : "Request id is not mentioned"} , {status : 404})
        }

        const bookingRequest = await prisma.artistRequest.findUnique({where : { id : requestId}})
        if (!bookingRequest || bookingRequest.status !== "pending") {
            return Response.json({ message : "Request is not valid" } , { status : 404 })
        }

        const updatedRequest = await prisma.artistRequest.update({
            where : { id : requestId},
            data : {
                status : updatedStatus,
            } 
        })

        return Response.json({ message : "Update successfully" , updatedRequest } , {status : 200} )
    } catch (error) {
        return Response.json({ message : "Internal error at accepting req funtction" , error} , {status : 400} )
    }
}