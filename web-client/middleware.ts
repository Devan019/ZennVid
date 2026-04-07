import { NextRequest, NextResponse } from "next/server";
import { FRONTEND_ROUTES } from "./constants/frontend_routes";

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl;
  if (!isAuthenticated && pathname.startsWith("/zennvid")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (isAuthenticated && pathname.includes("/auth")) {
    return NextResponse.redirect(new URL(FRONTEND_ROUTES.HOME, req.url));
  }

  return NextResponse.next();
}

