import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

let _jwtSecret: Uint8Array | null = null;
function getJwtSecret(): Uint8Array {
  if (!_jwtSecret) {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      throw new Error("ADMIN_JWT_SECRET environment variable is required.");
    }
    _jwtSecret = new TextEncoder().encode(secret);
  }
  return _jwtSecret;
}

// Customer protected routes (Clerk)
const isCustomerProtectedRoute = createRouteMatcher([
  "/bookings(.*)",
  "/profile(.*)",
  "/destinations/(.*)/book",
]);

async function verifyAdminJWT(token?: string) {
  if (!token) return false;
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // --- 1. Admin Portal & API Protection (JWT) ---
  if (pathname.startsWith("/api/admin")) {
    const adminToken =
      req.cookies.get("payana_admin_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const isValid = await verifyAdminJWT(adminToken);
    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized. Valid Admin JWT token required." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const adminToken = req.cookies.get("payana_admin_token")?.value;
    const isValid = await verifyAdminJWT(adminToken);

    if (pathname === "/admin/login") {
      if (isValid) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    // Require valid JWT for all other /admin paths
    if (!isValid) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // --- 2. Customer Routes Protection (Clerk) ---
  if (isCustomerProtectedRoute(req)) {
    try {
      await auth.protect();
    } catch (err) {
      console.error("Clerk auth protection error:", err);
    }
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
