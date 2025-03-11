import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for room data validation
const roomSchema = z.object({
  bedCount: z.number().int().min(1, 'Bed count must be at least 1'),
  roomNo: z.string().min(1, 'Room number is required'),
  status: z.string().optional(),
  rentPrice: z.number().min(0, 'Rent price cannot be negative'),
  pgId: z.number().int().min(1, 'PG ID is required'),
  images: z.any().optional()
});

export const POST = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    const body = await req.json();

    const parsedBody = roomSchema.safeParse(body.data);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsedBody.error.errors },
        { status: 400 }
      );
    }
    const roomData = {
      roomId: uuidv4(),
      bedCount: Number(parsedBody.data.bedCount),
      roomNo: parsedBody.data.roomNo,
      status: parsedBody.data.status || 'Available',
      rentPrice: Number(parsedBody.data.rentPrice),
      pgId: Number(parsedBody.data.pgId),
      images: parsedBody.data.images
    };

    const newRoom = await prisma.rooms.create({
      data: roomData
    });

    return NextResponse.json(newRoom, { status: 201 });
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
