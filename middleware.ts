/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  console.log("TOKEN IN MIDDLEWARE:", token);

  const isProtectedRoute =
    pathname.startsWith("/artist") || pathname.startsWith("/organizer");

  if (isProtectedRoute) {
    if (!token) {
      console.log("No token found");
      return NextResponse.redirect(new URL("/auth/artist/login", request.url));
    }

    try {
      const user = await verifyToken(token); // <-- now async
      console.log("✅ Middleware verified user:", user);
    } catch (err) {
      console.log("⛔ Middleware token invalid");
      return NextResponse.redirect(new URL("/auth/artist/login", request.url));
    }
  }

  return NextResponse.next();
}
