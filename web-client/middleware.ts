import { NextRequest, NextResponse } from "next/server";
import { FRONTEND_ROUTES } from "./constants/frontend_routes";

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl;
  // 🔒 If not authenticated and trying to access protected dashboard route
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // ✅ If already authenticated and trying to visit /auth page, redirect to dashboard
  if (isAuthenticated && pathname.includes("/auth")) {
    return NextResponse.redirect(new URL(FRONTEND_ROUTES.DASHBOARD, req.url));
  }

  return NextResponse.next();
}

