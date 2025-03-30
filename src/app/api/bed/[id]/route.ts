import prisma from '@/lib/prisma';
import {
  BadRequestError,
  ConflictError,
  errorHandler,
  NotFoundError
} from '@/services/utils/error';
import { BedStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: ' Bed Id is required' },
        { status: 400 }
      );
    }

    const bed = await prisma.beds.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        pgLocations: {
          select: {
            locationName: true
          }
        },
        rooms: {
          select: {
            roomNo: true
          }
        }
      }
    });
    if (!bed) {
      throw new NotFoundError('Bed Not Found');
    }
    return NextResponse.json(
      { data: bed, message: 'Bed list fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
const bedEditSchema = z.object({
  bedNo: z.string().min(1, 'Bed number is required'),
  status: z.string().min(1, 'Status is required'),
  images: z.any().optional(),
  roomNo: z.number().min(1, 'Room number is required'),
  pgId: z.number().min(1, 'PG ID is required')
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('PG location data not found');
    }
    if (!id) {
      throw new BadRequestError('Bed Id is required');
    }
    const body = await req.json();
    const parsedBody = bedEditSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsedBody.error.errors },
        { status: 400 }
      );
    }
    console.log('parsedBody', parsedBody);
    const existingBed = await prisma.beds.findFirst({
      where: {
        bedNo: parsedBody.data.bedNo,
        pgId: Number(pgLocationId),
        roomId: parsedBody.data.roomNo,
        id: { not: Number(id) }
      }
    });

    console.log('existingBed', existingBed);

    if (existingBed) {
      throw new ConflictError(`Bed No ${parsedBody.data.bedNo} already exists`);
    }

    const res = await prisma.beds.update({
      where: {
        id: Number(id)
      },
      data: {
        bedNo: parsedBody.data.bedNo,
        images: parsedBody.data.images,
        roomId: parsedBody.data.roomNo,
        status: parsedBody.data.status.toUpperCase() as BedStatus,
        pgId: Number(pgLocationId)
      }
    });
    return NextResponse.json(
      { data: res, message: 'successfully updated the bed', status: 200 },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
