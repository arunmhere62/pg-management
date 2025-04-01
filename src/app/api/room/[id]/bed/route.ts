import prisma from '@/lib/prisma';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Select PG location');
    }
    if (!id) {
      throw new BadRequestError('Invalid roomId or room id not provided');
    }
    const beds = await prisma.beds.findMany({
      where: {
        roomId: Number(id),
        pgId: Number(pgLocationId)
      },
      select: {
        images: false,
        bedNo: true,
        id: true,
        roomId: true
      }
    });

    return NextResponse.json(
      { data: beds, status: 200, message: 'Fetched the beds successfully' },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
