import prisma from '@/lib/prisma';
import { ConflictError, errorHandler } from '@/services/utils/error';
import { BedStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      return NextResponse.json(
        { error: 'PG location data not found in cookies' },
        { status: 400 }
      );
    }
    const rooms = await prisma.rooms.findMany({
      where: {
        pgId: Number(pgLocationId)
      },
      include: {
        pgLocations: {
          select: {
            locationName: true
          }
        },
        beds: true
      }
    });
    const formattedRooms = rooms.map((room) => ({
      totalBeds: room.beds.length,
      ...room
    }));
    if (!rooms || rooms.length === 0) {
      return NextResponse.json(
        { error: 'No rooms found for the given pgId' },
        { status: 404 }
      );
    }

    console.log('rooms', formattedRooms);

    return NextResponse.json(formattedRooms, { status: 200 });
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

// Zod schema for room data validation
const roomSchema = z.object({
  bedCount: z.number().int().min(1, 'Bed count must be at least 1'),
  roomNo: z.string().min(1, 'Room number is required'),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']),
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
    const { bedCount, roomNo, status, rentPrice, pgId } = parsedBody.data;

    const roomData = {
      roomId: uuidv4(),
      bedCount: Number(parsedBody.data.bedCount),
      roomNo: parsedBody.data.roomNo,
      status: parsedBody.data.status,
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
        status: 'VACANT' as BedStatus,
        images: []
      }));

      await prisma.beds.createMany({ data: beds });
      return newRoom;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return errorHandler(error);
  }
};
