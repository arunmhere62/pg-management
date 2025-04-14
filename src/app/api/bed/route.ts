import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  AppError,
  BadRequestError,
  ConflictError,
  errorHandler
} from '@/services/utils/error';

export const GET = async (req: NextRequest) => {
  try {
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('pg location not found');
    }

    const beds = await prisma.beds.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      select: {
        id: true,
        bedNo: true,
        images: false,
        pgId: true,
        roomId: true,
        createdAt: true,
        updatedAt: true,
        rooms: {
          select: {
            roomId: true,
            roomNo: true
          }
        },
        tenants: {
          where: {
            isDeleted: false
          },
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Determine bed status dynamically
    const formattedBeds = beds.map((bed) => ({
      ...bed,
      status: bed.tenants.length > 0 ? 'OCCUPIED' : 'VACANT'
    }));

    return NextResponse.json(
      {
        data: formattedBeds,
        status: 200,
        message: 'Fetched the beds successfully'
      },
      { status: 200 }
    );
  } catch (error: any) {
    return errorHandler(error);
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
    const parsedBody = bedCreateSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsedBody.error.errors },
        { status: 400 }
      );
    }

    const room = await prisma.rooms.findUnique({
      where: {
        id: Number(parsedBody.data.roomNo),
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      include: {
        beds: true
      }
    });

    if (!room) {
      throw new AppError(
        `Room with ID ${parsedBody.data.roomNo} not found`,
        404,
        'ROOM_NOT_FOUND'
      );
    }

    const existingBed = room.beds.find(
      (bed) => bed.bedNo === parsedBody.data.bedNo && bed.isDeleted === false
    );

    if (existingBed) {
      throw new ConflictError(
        `A bed with number ${parsedBody.data.bedNo} already exists in room ${parsedBody.data.roomNo}`
      );
    }

    const softDeletedBed = room.beds.find(
      (bed) => bed.bedNo === parsedBody.data.bedNo && bed.isDeleted === true
    );

    if (softDeletedBed) {
      const restoredBed = await prisma.beds.update({
        where: { id: softDeletedBed.id },
        data: {
          isDeleted: false,
          images: parsedBody.data.images
        }
      });

      return NextResponse.json(
        {
          data: restoredBed,
          message: 'Restored previously deleted bed',
          status: 201
        },
        { status: 201 }
      );
    }

    const createdBed = await prisma.beds.create({
      data: {
        bedNo: parsedBody.data.bedNo,
        pgId: parsedBody.data.pgId,
        images: parsedBody.data.images,
        roomId: parsedBody.data.roomNo
      }
    });

    return NextResponse.json(
      {
        data: createdBed,
        message: 'Created the bed successfully',
        status: 201
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log('Error in POST /bed:', error);
    return errorHandler(error);
  }
};
