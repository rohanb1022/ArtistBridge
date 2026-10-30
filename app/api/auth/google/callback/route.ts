import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Determine base URL dynamically
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Decode role from state
  let role: "artist" | "organizer" = "artist";
  if (state) {
    try {
      const decodedState = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
      if (decodedState.role === "organizer" || decodedState.role === "artist") {
        role = decodedState.role;
      }
    } catch (e) {
      console.warn("Failed to decode OAuth state:", e);
    }
  }

  // Handle user cancellation or Google error
  if (error) {
    const errorMsg = encodeURIComponent(`Google authentication failed: ${error}`);
    return NextResponse.redirect(new URL(`/auth/${role}/login?error=${errorMsg}`, baseUrl));
  }

  if (!code) {
    const errorMsg = encodeURIComponent("No authorization code received from Google");
    return NextResponse.redirect(new URL(`/auth/${role}/login?error=${errorMsg}`, baseUrl));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const errorMsg = encodeURIComponent(
      "Google OAuth credentials missing on the server. Please check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
    );
    return NextResponse.redirect(new URL(`/auth/${role}/login?error=${errorMsg}`, baseUrl));
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google token exchange error:", tokenData);
      const errorMsg = encodeURIComponent("Failed to exchange code with Google");
      return NextResponse.redirect(new URL(`/auth/${role}/login?error=${errorMsg}`, baseUrl));
    }

    // 2. Fetch user profile from Google
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoResponse.json();

    if (!userinfoResponse.ok || !profile.email) {
      console.error("Google userinfo fetch error:", profile);
      const errorMsg = encodeURIComponent("Could not retrieve email profile from Google");
      return NextResponse.redirect(new URL(`/auth/${role}/login?error=${errorMsg}`, baseUrl));
    }

    const email = profile.email.toLowerCase().trim();
    const name = profile.name || email.split("@")[0] || "User";

    // 3. Process Authentication by Role
    if (role === "artist") {
      let artist = await prisma.artist.findUnique({
        where: { email },
      });

      let isNewArtist = false;

      if (!artist) {
        // Create new artist with a secure random password
        const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10);
        artist = await prisma.artist.create({
          data: {
            name,
            email,
            password: randomPassword,
            category: [],
            city: null,
          },
        });
        isNewArtist = true;
      }

      // Generate JWT session token
      const token = generateToken({ id: artist.id.toString(), role: "artist" });

      // Determine if profile is already complete
      const isProfileComplete =
        !isNewArtist &&
        Array.isArray(artist.category) &&
        artist.category.length > 0 &&
        !!artist.price &&
        !!artist.bio &&
        !!artist.bestEvent &&
        !!artist.city;

      // Direct new or incomplete artists to the detailed setup page
      const targetPath = isProfileComplete ? "/artist/home" : "/artist/artistdetails";
      const response = NextResponse.redirect(new URL(targetPath, baseUrl));

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Clear OAuth state cookie
      response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });

      return response;
    } else {
      // Role is organizer
      let organizer = await prisma.organizer.findUnique({
        where: { email },
      });

      if (!organizer) {
        // Create new organizer
        const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10);
        organizer = await prisma.organizer.create({
          data: {
            name,
            email,
            password: randomPassword,
          },
        });
      }

      // Generate JWT session token
      const token = generateToken({ id: organizer.id.toString(), role: "organizer" });
      const response = NextResponse.redirect(new URL("/organizer/home", baseUrl));

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      // Clear OAuth state cookie
      response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });

      return response;
    }
  } catch (err) {
    console.error("OAuth Callback Exception:", err);
    const errorMsg = encodeURIComponent("An error occurred during Google sign-in. Please try again.");
    return NextResponse.redirect(new URL(`/auth/${role}/login?error=${errorMsg}`, baseUrl));
  }
}

