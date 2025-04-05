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

    const room = await prisma.rooms.findUnique({
      where: {
        id: Number(id),
        isDeleted: false
      },
      select: {
        id: true,
        roomId: true,
        pgId: true,
        bedCount: true,
        roomNo: true,
        updatedAt: true,
        createdAt: true,
        rentPrice: true,
        images: true,
        beds: {
          select: {
            id: true,
            bedNo: true,
            tenants: {
              select: { id: true }
            }
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
  bedCount: z.number().int().min(0, 'Bed count must be at least 0'),
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

    const { roomNo, bedCount, rentPrice, images } = validatedData.data;

    if (!id) {
      throw new BadRequestError('RoomId is required');
    }

    const existingRoom = await prisma.rooms.findUnique({
      where: {
        id: Number(id),
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      include: {
        beds: true
      }
    });

    if (!existingRoom) {
      throw new NotFoundError('Room not found');
    }

    const existingBedCount = existingRoom.beds.length;

    if (bedCount < existingBedCount) {
      throw new BadRequestError(
        `Cannot reduce bed count to ${bedCount}. Already ${existingBedCount} exists. Delete and reduce manually.`
      );
    }

    // Update room details
    const updatedRoom = await prisma.rooms.update({
      where: {
        id: Number(id)
      },
      data: {
        roomNo,
        bedCount: Number(bedCount),
        rentPrice: Number(rentPrice),
        images
      }
    });

    // If bed count increased, create new beds
    if (bedCount > existingBedCount) {
      const newBeds = Array.from(
        { length: bedCount - existingBedCount },
        (_, index) => ({
          bedNo: `BED${existingBedCount + index + 1}`,
          roomId: updatedRoom.id,
          pgId: updatedRoom.pgId,
          images: []
        })
      );

      await prisma.beds.createMany({ data: newBeds });
    }

    return NextResponse.json(
      { data: updatedRoom, message: 'Updated the room', status: 200 },
      { status: 200 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};
