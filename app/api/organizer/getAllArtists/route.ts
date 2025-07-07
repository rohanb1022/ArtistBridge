import { withAuth } from "@/lib/middleware";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req : Request){
    const org = withAuth(req);
    if (!org) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const artists = await prisma.artist.findMany({});
        console.log(artists)
        if (!artists || artists.length === 0) {
            return NextResponse.json({ message: "No artists found" }, { status: 404 });
        }
        return NextResponse.json(artists);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("An unknown error occurred");
        }
        return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
    }
}