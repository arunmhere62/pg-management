import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const GET = async (req: NextRequest) => {
  try {
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      return NextResponse.json(
        { error: 'PG location data not found in cookies' },
        { status: 400 }
      );
    }
    const beds = await prisma.beds.findMany({
      where: {
        pgId: Number(pgLocationId)
      },
      select: {
        id: true,
        bedNo: true,
        images: true,
        pgId: true,
        roomId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        rooms: {
          select: {
            roomId: true,
            roomNo: true
          }
        }
      }
    });
    return NextResponse.json(beds, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching beds:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

const bedCreateSchema = z.object({
  bedNo: z.string().min(1, 'Bed number is required'),
  images: z.any().optional(),
  roomNo: z.number().min(1, 'Room number is required'),
  pgId: z.number().min(1, 'PG ID is required')
});

export const POST = async (req: NextRequest) => {
  try {
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      return NextResponse.json(
        { error: 'PG location data not found in cookies' },
        { status: 400 }
      );
    }
    const body = await req.json();
    const parsedBody = bedCreateSchema.safeParse(body.data);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsedBody.error.errors },
        { status: 400 }
      );
    }
    const res = await prisma.beds.create({
      data: {
        bedNo: parsedBody.data?.bedNo,
        pgId: parsedBody.data?.pgId,
        images: parsedBody.data?.images,
        roomId: parsedBody.data?.roomNo
      }
    });
    return NextResponse.json(res, { status: 201 });
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
