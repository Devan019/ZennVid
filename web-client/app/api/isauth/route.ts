import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL('/dashboard/prompt2video', req.url);

  const res = NextResponse.redirect(url);
  res.cookies.set('is-authenticated', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}