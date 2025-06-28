import { cookies } from "next/headers";

export const setAuthCookie = async (token: string) => {
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
};

export const clearAuthCookie = async () => {
  (await cookies()).set("token", "", {
    maxAge: 0,
    path: "/",
  });
};
