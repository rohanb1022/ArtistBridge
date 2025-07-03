/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute =
    pathname.startsWith("/artist") || pathname.startsWith("/organizer");

  const isAuthRoute = pathname.startsWith("/auth");

  // If user tries to access protected route without token
  if (isProtectedRoute) {
    if (!token) {
      console.log(" No token found — redirecting to login");
      return NextResponse.redirect(new URL("/auth/artist/login", request.url));
    }
    try {
      const {id , role} = await verifyToken(token);
      if (role === "artist" && pathname.startsWith("/organizer")) {
        console.log(" Artist trying to access organizer route — redirecting to artist home");
        return NextResponse.redirect(new URL("/artist/home", request.url));
      }else if (role === "organizer" && pathname.startsWith("/artist")) {
        console.log(" Organizer trying to access artist route — redirecting to organizer home");
        return NextResponse.redirect(new URL("/organizer/home", request.url));
      }
    } catch (err) {
      console.log(" Middleware token invalid — redirecting to login");
      return NextResponse.redirect(new URL("/auth/artist/login", request.url));
    }
}

  // If user tries to access auth route but already has valid token
  if (isAuthRoute && token) {
    try {
      const user = await verifyToken(token);

      const redirectTo =
        user.role === "artist" ? "/artist/home" : "/organizer/home";

      return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch (err) {
      console.log("Token invalid while on auth route — allowing access to login/signup");
      return NextResponse.next(); // let them access login/signup
    }
  }

  return NextResponse.next(); // default: allow access
}
