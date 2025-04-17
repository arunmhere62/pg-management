import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Get the expiration time from the auth config
  const expirySeconds = 30; // This should match the maxAge in auth.config.ts

  return NextResponse.json({
    expirySeconds,
    success: true
  });
}
