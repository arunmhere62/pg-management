import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error('NEXTAUTH_SECRET is not set');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const token = await getToken({
      req,
      secret,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    console.log('Token in middleware:', {
      exists: !!token,
      url: req.url,
      env: process.env.NODE_ENV
    });

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)']
};

export const runtime = 'nodejs';
