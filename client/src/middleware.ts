import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

// Define public routes that are explicitly allowed
const publicRoutes = ["/login", "/signup"];

// Function to check if a route is a static or internal file
function isStaticOrInternalPath(path: string) {
  return (
    path.startsWith("/_next/") || // Next.js static files
    path.startsWith("/static/") || // Custom static files
    path.startsWith("/favicon.ico") || // Favicon
    path.startsWith("/api/") // API routes
  );
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow static files and internal paths
  if (isStaticOrInternalPath(path)) {
    return NextResponse.next();
  }

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = cookies().get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  console.log("Session user ID:", session?.userId);

  // If the path is public, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For non-public routes, check authentication
  if (!session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Allow authenticated access to non-public routes
  return NextResponse.next();
}