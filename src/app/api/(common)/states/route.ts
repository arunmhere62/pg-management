import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const { countryCode } = await req.json();
    if (!countryCode) {
      return NextResponse.json(
        { error: 'countryCode is required' },
        { status: 400 }
      );
    }
    const states = await prisma.state.findMany({
      where: {
        countryCode: countryCode
      }
    });
    return NextResponse.json(states, { status: 200 });
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json(
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
