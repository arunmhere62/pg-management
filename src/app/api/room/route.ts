import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      return NextResponse.json(
        { error: 'PG location data not found in cookies' },
        { status: 400 }
      );
    }
    const rooms = await prisma.rooms.findMany({
      where: {
        pgId: Number(pgLocationId)
      },
      include: {
        pgLocations: {
          select: {
            locationName: true
          }
        }
      }
    });
    if (!rooms || rooms.length === 0) {
      return NextResponse.json(
        { error: 'No rooms found for the given pgId' },
        { status: 404 }
      );
    }
    return NextResponse.json(rooms, { status: 200 });
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
