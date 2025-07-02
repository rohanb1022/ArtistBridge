/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  console.log("TOKEN IN MIDDLEWARE:", token);

  const isProtectedRoute =
    pathname.startsWith("/artist") || pathname.startsWith("/organizer");

  const isAuthRoute = pathname.startsWith("/auth");

  // If user tries to access protected route without token
  if (isProtectedRoute) {
    if (!token) {
      console.log("🔒 No token found — redirecting to login");
      return NextResponse.redirect(new URL("/auth/artist/login", request.url));
    }

    try {
      const user = await verifyToken(token);
      console.log("✅ Middleware verified user:", user);
    } catch (err) {
      console.log("⛔ Middleware token invalid — redirecting to login");
      return NextResponse.redirect(new URL("/auth/artist/login", request.url));
    }
  }

  // If user tries to access auth route but already has valid token
  if (isAuthRoute && token) {
    try {
      const user = await verifyToken(token);
      console.log("⚠️ Already logged in — redirecting to home");

      const redirectTo =
        user.role === "artist" ? "/artist/home" : "/organizer/home";

      return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch (err) {
      console.log("⛔ Token invalid while on auth route — allowing access to login/signup");
      return NextResponse.next(); // let them access login/signup
    }
  }

  return NextResponse.next(); // default: allow access
}
