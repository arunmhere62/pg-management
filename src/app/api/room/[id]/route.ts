import prisma from '@/lib/prisma';
import {
  BadRequestError,
  ConflictError,
  errorHandler,
  NotFoundError
} from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

const roomSchema = z.object({
  images: z.array(z.string()).optional(), // Array of image URLs (optional)
  roomNo: z.string().min(1, 'Room number is required'), // Room number as a string
  bedCount: z.number().int().min(0, 'Bed count must be at least 0'), // Non-negative integer
  status: z.string().min(1, 'Status is required'), // Status as a string
  rentPrice: z.number().min(0, 'Rent price must be a positive number'), // Rent price (>= 0)
  pgId: z.number().int().positive('PG ID must be a positive integer') // Positive integer for pgId
});

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
    const validatedData = roomSchema.safeParse(body.data);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.errors },
        { status: 400 }
      );
    }
    const { roomNo, bedCount, status, rentPrice, images } = validatedData.data;
    if (!id) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }
    const existingRoom = await prisma.rooms.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        beds: true
      }
    });
    if (!existingRoom) {
      throw new NotFoundError('Room not found');
    }
    const duplicateRoom = await prisma.rooms.findFirst({
      where: {
        roomNo,
        id: { not: Number(id) }
      }
    });
    if (duplicateRoom) {
      throw new ConflictError('Room No already exists, try another number');
    }
    const existingBedCount = existingRoom.beds.length;
    if (bedCount < existingBedCount) {
      throw new BadRequestError(
        `Cannot reduce bed count to ${bedCount}. Already  ${existingBedCount} exists delete and reduce here .`
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
    return errorHandler(error);
  }
};
