// middleware.ts
import { auth } from '@/lib/auth'; // Make sure this points to your `NextAuth(authConfig)`
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const url = request.nextUrl.clone();

  console.log('Token in middleware:', {
    exists: !!session,
    url: request.url,
    env: process.env.NODE_ENV
  });

  // Check if session exists
  if (!session) {
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', request.nextUrl.pathname); // optional: add return-to path
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)']
};
