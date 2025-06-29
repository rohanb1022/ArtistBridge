import { cookies } from "next/headers";

export async function POST() {
  // Delete the cookie
  (await
        // Delete the cookie
        cookies()).delete("auth_token");

  return Response.json({
    message: "Logout successful",
  });
}
