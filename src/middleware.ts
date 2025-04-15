import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log('token', token);

  // Check if the token exists (i.e., user is authenticated)
  if (!token) {
    // If no token, redirect to the login page
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

// Optional: remove all matchers too
export const config = {
  matcher: []
};
