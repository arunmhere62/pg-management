import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('token', token);

  const isAuth = !!token;

  const { pathname } = req.nextUrl;

  if (!isAuth && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isAuth && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*']
};
