import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // ✅ Correctly import `auth` from your auth config

export const GET = async (req: NextRequest) => {
  try {
    // ✅ Use `auth()` instead of `getServerSession()`
    const session = await auth();

    // ✅ Ensure session exists before accessing user properties
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 User ID:', session.user.id);
    console.log('🔍 User Session:', session);
  } catch (error) {
    console.error('❌ Error fetching session:', error);
    return NextResponse.json(
      { error: 'Error fetching session' },
      { status: 500 }
    );
  }
};
