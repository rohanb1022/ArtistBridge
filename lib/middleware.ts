import { verifyToken } from "./auth";

export async function withAuth(req: Request) {
  try {
    const authHeader = req.headers.get("authorization"); // this is the actual method we use to fetch the token from the routes and also pass the token in required routes

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1]; // using split method we separate the bearer from the actual token
    // token will be a object which will return user info which we can access such as token.id , token.name

    const decode = verifyToken(token)

    return decode;
  } catch (error) {
    console.log("auth error" + error);
  }
}
