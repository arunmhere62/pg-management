import prisma from '@/lib/prisma';
import { BadRequestError } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) => {
  try {
    const { roomId } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('PG location data not found in cookies');
    }
    if (!roomId) {
      throw new BadRequestError('Invalid roomId or room id not provided');
    }
    const beds = await prisma.beds.findMany({
      where: { roomId: Number(roomId), pgId: Number(pgLocationId) }
    });

    return NextResponse.json(beds, { status: 200 });
  } catch (error) {
    console.error('Error fetching beds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
