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

  // Block logged-in users from auth routes
  if (isAuthRoute && token) {
    try {
      verifyToken(token);
      return NextResponse.redirect(new URL("/home", request.url));
    } catch {
      // Invalid token, allow to proceed to login/signup
    }
  }

  // Block unauthenticated access to protected pages
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/artist/login", request.url));
    }

    try {
      verifyToken(token); // Verify token is valid (not expired or fake)
    } catch {
      return NextResponse.redirect(new URL("/auth/artist/login", request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/auth/:path*", "/home/:path*", "/profile/:path*", "/bookings/:path*"],
};
