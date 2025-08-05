import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get("is-authenticated")?.value === "true";
  const { pathname } = req.nextUrl;
  // 🔒 If not authenticated and trying to access protected dashboard route
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // ✅ If already authenticated and trying to visit /auth page, redirect to dashboard
  if (isAuthenticated && pathname.includes("/auth")) {
    return NextResponse.redirect(new URL("/dashboard/Prompt2Video", req.url));
  }

  return NextResponse.next();
}

