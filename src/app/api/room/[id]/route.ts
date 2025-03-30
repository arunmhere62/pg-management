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

    return NextResponse.json(
      { data: res, message: 'Successfully fetched the room' },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

const roomSchema = z.object({
  images: z.array(z.string()).optional(),
  roomNo: z.string().min(1, 'Room number is required'),
  bedCount: z.number().int().min(0, 'Bed count must be at least 0'),
  status: z.string().min(1, 'Status is required'),
  rentPrice: z.number().min(0, 'Rent price must be a positive number'),
  pgId: z.number().int().positive('PG ID must be a positive integer')
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
      throw new BadRequestError('Location ID is required');
    }
    const body = await req.json();
    const validatedData = roomSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.errors },
        { status: 400 }
      );
    }
    const { roomNo, bedCount, status, rentPrice, images } = validatedData.data;
    if (!id) {
      throw new BadRequestError('RoomId is required');
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
        roomNo: body.roomNo,
        bedCount: Number(body.bedCount),
        status: body.status,
        rentPrice: Number(body.rentPrice),
        images: body.images
      }
    });

    return NextResponse.json(
      { data: updatedRoom, message: 'updated the room', status: 200 },
      { status: 200 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};
