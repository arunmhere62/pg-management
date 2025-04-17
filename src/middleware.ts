// middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const pgLocationId = request.cookies.get('pgLocationId')?.value;

  // 1. Not logged in → only allow /login
  if (!session) {
    if (pathname !== '/login') {
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2. Logged in, but no pgLocationId → only allow /new-pg
  if (!pgLocationId) {
    if (pathname !== '/new-pg') {
      return NextResponse.redirect(new URL('/new-pg', request.url));
    }
    return NextResponse.next();
  }

  // 3. Logged in and has pgLocationId → block /login, /new-pg, and /
  if (pathname === '/login' || pathname === '/new-pg' || pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard/overview', request.url));
  }

  // 4. All good
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
