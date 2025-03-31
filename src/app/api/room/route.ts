import prisma from '@/lib/prisma';
import {
  BadRequestError,
  ConflictError,
  errorHandler,
  NotFoundError
} from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Pg location is necessary');
    }

    const rooms = await prisma.rooms.findMany({
      where: {
        pgId: Number(pgLocationId)
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
        images: false,
        pgLocations: {
          select: {
            images: false,
            locationName: true
          }
        },
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

    const formattedRooms = rooms.map((room) => {
      const totalBeds = room.beds.length;
      const occupiedBeds = room.beds.filter(
        (bed) => bed.tenants.length > 0
      ).length;

      // Room is FULL if all beds are occupied, otherwise AVAILABLE
      const status = occupiedBeds === totalBeds ? 'FULL' : 'AVAILABLE';

      return {
        ...room,
        totalBeds,
        occupiedBeds,
        status
      };
    });

    if (!rooms || rooms.length === 0) {
      throw new NotFoundError('No room found');
    }

    return NextResponse.json(
      {
        data: formattedRooms,
        message: 'Rooms fetched successfully',
        status: 200
      },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

// Zod schema for room data validation
const roomSchema = z.object({
  bedCount: z.number().int().min(1, 'Bed count must be at least 1'),
  roomNo: z.string().min(1, 'Room number is required'),
  rentPrice: z.number().min(0, 'Rent price cannot be negative'),
  pgId: z.number().int().min(1, 'PG ID is required'),
  images: z.any().optional()
});

export const POST = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    const body = await req.json();
    const parsedBody = roomSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsedBody.error.errors },
        { status: 400 }
      );
    }
    const { bedCount, roomNo, rentPrice, pgId } = parsedBody.data;

    const roomData = {
      roomId: uuidv4(),
      bedCount: Number(parsedBody.data.bedCount),
      roomNo: parsedBody.data.roomNo,
      rentPrice: Number(parsedBody.data.rentPrice),
      pgId: Number(parsedBody.data.pgId),
      images: parsedBody.data.images
    };
    const existingRoom = await prisma.rooms.findFirst({
      where: {
        roomNo: roomData.roomNo,
        pgId: roomData.pgId
      }
    });

    if (existingRoom) {
      throw new ConflictError(
        'A room with this number already exists in the same PG.'
      );
    }
    const result = await prisma.$transaction(async (prisma) => {
      const newRoom = await prisma.rooms.create({
        data: roomData
      });

      const beds = Array.from({ length: bedCount }, (_, index) => ({
        bedNo: `BED${index + 1}`,
        roomId: newRoom.id,
        pgId: newRoom.pgId,
        images: []
      }));

      await prisma.beds.createMany({ data: beds });
      return newRoom;
    });

    return NextResponse.json(
      {
        data: result,
        message: 'successfully created the room and its beds',
        status: 201
      },
      { status: 201 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};
