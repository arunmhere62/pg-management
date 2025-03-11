import prisma from '@/lib/prisma';
import { BedStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: ' Bed Id is required' },
        { status: 400 }
      );
    }

    const bed = await prisma.beds.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        pgLocations: {
          select: {
            locationName: true
          }
        },
        rooms: {
          select: {
            roomNo: true
          }
        }
      }
    });
    if (!bed) {
      return NextResponse.json({ message: 'Bed not found' }, { status: 404 });
    }
    return NextResponse.json(bed, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
const bedEditSchema = z.object({
  bedNo: z.string().min(1, 'Bed number is required'),
  status: z.string().min(1, 'Status is required'),
  images: z.any().optional(),
  roomNo: z.number().min(1, 'Room number is required'),
  pgId: z.number().min(1, 'PG ID is required')
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      return NextResponse.json(
        { error: 'PG location data not found in cookies' },
        { status: 400 }
      );
    }
    if (!id) {
      return NextResponse.json(
        { error: ' Bed Id is required' },
        { status: 400 }
      );
    }
    const body = await req.json();
    const parsedBody = bedEditSchema.safeParse(body.data);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsedBody.error.errors },
        { status: 400 }
      );
    }
    const res = await prisma.beds.update({
      where: {
        id: Number(id)
      },
      data: {
        bedNo: parsedBody.data.bedNo,
        images: parsedBody.data.images,
        roomId: parsedBody.data.roomNo,
        status: parsedBody.data.status.toUpperCase() as BedStatus,
        pgId: Number(pgLocationId)
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
