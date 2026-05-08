import { NextRequest, NextResponse } from "next/server";
import { FRONTEND_ROUTES } from "./constants/frontend_routes";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value
  const refreshToken = req.cookies.get("refresh_token")?.value

  const { pathname } = req.nextUrl;
  if (!accessToken && !refreshToken && pathname.startsWith("/zennvid")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (accessToken && pathname.includes("/auth")) {
    return NextResponse.redirect(new URL(FRONTEND_ROUTES.HOME, req.url));
  }

  return NextResponse.next();
}

