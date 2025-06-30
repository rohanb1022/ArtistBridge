import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute = ["/home", "/profile", "/bookings"].some((p) =>
    pathname.startsWith(p)
  );

  // Simple short circuit
  if (isAuthRoute && token) {
    try {
      verifyToken(token);
      return NextResponse.redirect(new URL("/home", request.url));
    } catch {
      // invalid token, allow access to auth routes
    }
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/artist/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/home/:path*", "/profile/:path*", "/bookings/:path*"],
};
