/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/auth";
import { DecodedUser } from "@/types";

export async function withAuth(req: Request): Promise<DecodedUser | null> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token) as unknown as DecodedUser;
    return decoded;
  } catch (err) {
    console.error("Authentication error:", err);
    return null;
  }
}
