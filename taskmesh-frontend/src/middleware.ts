import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)", "/leader(.*)", "/api(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname === "/api/health") return;
  if (isProtectedRoute(request)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/api/(.*)"]
};
