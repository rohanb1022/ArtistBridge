import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "rohanbhangale101022";

export function generateToken(payload: { id: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Shared secret
const secret = new TextEncoder().encode(JWT_SECRET);

// Replace this ONLY for verification in middleware
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,  
      role: payload.role as string
    }
  } catch (err) {
    console.error("JOSE token verification failed:", err);
    throw new Error("Invalid token");
  }
}

