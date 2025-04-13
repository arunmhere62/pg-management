import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;

  const { pathname } = req.nextUrl;
  const pgLocationId = req.cookies.get('pgLocationId')?.value;

  // 🚫 Block unauthenticated access to /dashboard
  if (!isAuth && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 🚫 Block unauthenticated access to /new-pg
  if (!isAuth && pathname === '/new-pg') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ✅ Redirect logged-in user from / to dashboard
  if (isAuth && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 🚫 If authenticated but no pgLocationId, restrict other routes except /new-pg and /
  const isProtectedRoute = !['/', '/new-pg'].includes(pathname);
  if (isAuth && !pgLocationId && isProtectedRoute) {
    return NextResponse.redirect(new URL('/new-pg', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/new-pg',
    '/dashboard/:path*',
    '/((?!_next|api|favicon.ico|static).*)'
  ]
};
