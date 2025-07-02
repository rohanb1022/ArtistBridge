import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

export function generateToken(payload: { id: string; role: string }) {
  return jwt.sign(payload, "rohanbhangale101022" , { expiresIn: "7d" });
}

// Shared secret
const secret = new TextEncoder().encode("rohanbhangale101022");

// Replace this ONLY for verification in middleware
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: Number(payload.id) ,  
      role: payload.role as string
    }
  } catch (err) {
    console.error("JOSE token verification failed:", err);
    throw new Error("Invalid token");
  }
}

