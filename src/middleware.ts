import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Optional: remove all matchers too
export const config = {
  matcher: []
};
