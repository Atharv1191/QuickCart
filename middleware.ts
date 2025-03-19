import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Ensure Clerk middleware runs for all API and protected routes
    "/((?!_next|.*\\..*).*)",
    "/api/(.*)",
  ],
};
