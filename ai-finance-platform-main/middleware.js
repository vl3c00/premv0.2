import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    }),
  ],
});

const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const token = req.cookies.get("userToken");
  const tokenExpiration = req.cookies.get("userTokenExpiration");

  const isTokenExpired = tokenExpiration ? new Date() > new Date(tokenExpiration) : true;

  if (isProtectedRoute(req)) {
    if (!token || isTokenExpired) {
      console.log("Token missing or expired, redirecting to token entry...");
      return NextResponse.redirect(new URL(`/enter-token?redirect=${req.nextUrl.pathname}`, req.url));
    }

    if (!userId) {
      console.log("User not authenticated, redirecting to sign-in...");
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
});

export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
