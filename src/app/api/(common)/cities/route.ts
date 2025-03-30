import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path if needed
import { errorHandler } from '@/services/utils/error';

export const GET = async (req: NextRequest) => {
  try {
    const stateCode = req.nextUrl.searchParams.get('stateIsoCode');
    if (!stateCode) {
      return NextResponse.json(
        { error: 'stateCode is required' },
        { status: 400 }
      );
    }
    const cityList = await prisma.city.findMany({
      where: { stateCode: stateCode }
    });
    return NextResponse.json(
      { data: cityList, message: 'Cities fetched successfully', status: 200 },
      { status: 200 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};
