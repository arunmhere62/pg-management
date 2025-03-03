import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // ✅ Correctly import `auth` from your auth config
import { getPgListService } from './service';

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    const userId = session?.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }
    console.log('userId', userId);

    const pgList = await getPgListService(Number(userId));
    console.log('pgList', pgList);

    return NextResponse.json(pgList, { status: 200 });
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      NextResponse.json(
        { error: 'Database query error', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
};
