import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const runtime = "nodejs";


export async function POST() {
  (await cookies()).delete("token");
  return NextResponse.json({message: "Logout successful"}, { status: 200 });
}
