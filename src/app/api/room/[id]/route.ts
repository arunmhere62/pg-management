import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Id is required' }, { status: 400 });
    }

    const res = await prisma.rooms.findUnique({
      where: {
        id: Number(id)
      }
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    const { id } = await params;

    if (!pgLocationId) {
      return NextResponse.json({
        error: 'PG location data not found in cookies',
        status: 400
      });
    }

    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const updatedRoom = await prisma.rooms.update({
      where: { id: Number(id) },
      data: {
        roomNo: body.data.roomNo,
        bedCount: Number(body.data.bedCount),
        status: body.data.status,
        rentPrice: Number(body.data.rentPrice),
        images: body.data.images
      }
    });

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
};
