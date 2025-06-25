import { verifyToken } from "./auth";
import { DecodedUser } from "@/types";

export async function withAuth(req: Request): Promise<DecodedUser | null> {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token) as unknown as DecodedUser;

    return decoded;
  } catch (error) {
    console.log("auth error: " + error);
    return null;
  }
}
