import prisma from '@/lib/prisma';
import {
  BadRequestError,
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

    const room = await prisma.rooms.findUnique({
      where: {
        id: Number(id),
        isDeleted: false
      },
      include: {
        beds: {
          where: {
            isDeleted: false
          },
          include: {
            tenants: true
          }
        }
      }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Compute room status dynamically
    const totalBeds = room.beds.length;
    const occupiedBeds = room.beds.filter(
      (bed) => bed.tenants.length > 0
    ).length;
    const status = occupiedBeds === totalBeds ? 'FULL' : 'AVAILABLE';

    return NextResponse.json(
      {
        data: { ...room, totalBeds, occupiedBeds, status },
        message: 'Successfully fetched the room'
      },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

const roomSchema = z.object({
  images: z.array(z.string()).optional(),
  roomNo: z.string().min(1, 'Room number is required'),
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

    const { roomNo, rentPrice, images } = validatedData.data;

    if (!id) {
      throw new BadRequestError('RoomId is required');
    }

    const existingRoom = await prisma.rooms.findUnique({
      where: {
        id: Number(id),
        pgId: Number(pgLocationId),
        isDeleted: false
      }
    });

    if (!existingRoom) {
      throw new NotFoundError('Room not found');
    }

    const updatedRoom = await prisma.rooms.update({
      where: {
        id: Number(id)
      },
      data: {
        roomNo,
        rentPrice: Number(rentPrice),
        images
      }
    });

    return NextResponse.json(
      {
        data: updatedRoom,
        message: 'Updated the room successfully',
        status: 200
      },
      { status: 200 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};
