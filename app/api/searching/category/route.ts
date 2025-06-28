import { PrismaClient } from "@prisma/client";

const prisma = PrismaClient()

export async function GET(req : Request) {
    const { searchParams } = new URL(req.url)
    const  category  =  searchParams.get("category")

    if (!category) {
        return Response.json({ message : "No category found" } , {status : 400} )
    }

    try {
        const artist = await prisma.artist.findMany({
            where : {
                category : {
                    equals : category,
                    mode : "insensitive"
                }
            }
        })

        return Response.json({ artist } , { status : 200})
    } catch (error) {
        return Response.json({ message : "Some Internal error" , error } , { status : 500 } )
    }
}