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
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      select: {
        id: true,
        roomId: true,
        pgId: true,
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
          where: {
            isDeleted: false
          },
          select: {
            id: true,
            bedNo: true,
            tenants: {
              select: {
                id: true,
                name: true
              }
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
      const totalAmount = (room.rentPrice?.toNumber() || 0) * totalBeds;
      const status =
        totalBeds > 0 && occupiedBeds === totalBeds ? 'FULL' : 'AVAILABLE';

      return {
        ...room,
        totalBeds,
        occupiedBeds,
        status,
        totalAmount
      };
    });

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

    const { roomNo, rentPrice, pgId, images } = parsedBody.data;

    const roomData = {
      roomId: uuidv4(),
      roomNo,
      rentPrice: Number(rentPrice),
      pgId: Number(pgId),
      images
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

    const newRoom = await prisma.rooms.create({ data: roomData });

    return NextResponse.json(
      {
        data: newRoom,
        message: 'Room created successfully',
        status: 201
      },
      { status: 201 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};
