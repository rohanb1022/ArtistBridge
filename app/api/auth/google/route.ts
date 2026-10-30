import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") === "organizer" ? "organizer" : "artist";

  // Determine base URL dynamically or from environment
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId.trim() === "" || clientId.includes("your-google-client-id")) {
    const errorMsg = encodeURIComponent(
      "Google OAuth is not configured yet. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file."
    );
    return NextResponse.redirect(new URL(`/auth/${role}/login?error=${errorMsg}`, baseUrl));
  }

  // Generate a random nonce and state
  const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const stateData = { role, nonce };
  const state = Buffer.from(JSON.stringify(stateData)).toString("base64url");

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(googleAuthUrl.toString());

  // Store state in a secure HTTP-only cookie for CSRF validation
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}

