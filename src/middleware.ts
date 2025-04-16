// middleware.ts
import { auth } from '@/lib/auth'; // Make sure this points to your `NextAuth(authConfig)`
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = auth();
  const url = request.nextUrl.clone();

  console.log('Token in middleware:', {
    exists: !!session,
    url: request.url,
    env: process.env.NODE_ENV
  });

  if (!session) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Paths you want middleware to run on
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'] // customize as needed
};
