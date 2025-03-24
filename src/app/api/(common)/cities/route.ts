import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path if needed

export const GET = async (req: NextRequest) => {
  try {
    // ✅ Extract stateCode from query parameters
    const stateCode = req.nextUrl.searchParams.get('stateIsoCode');

    if (!stateCode) {
      return NextResponse.json(
        { error: 'stateCode is required' },
        { status: 400 }
      );
    }

    // ✅ Fetch cities where stateCode matches
    const cityList = await prisma.city.findMany({
      where: { stateCode: stateCode }
    });

    return NextResponse.json(cityList, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching cities:', error);

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
};
