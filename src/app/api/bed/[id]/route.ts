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
      return NextResponse.json(
        { error: 'Bed Id is required' },
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
        },
        tenants: {
          select: {
            id: true // Checking if tenant exists
          }
        }
      }
    });

    if (!bed) {
      throw new NotFoundError('Bed Not Found');
    }

    // Determine bed status dynamically
    const status = bed.tenants.length > 0 ? 'OCCUPIED' : 'VACANT';

    return NextResponse.json(
      { data: { ...bed, status }, message: 'Bed list fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

const bedEditSchema = z.object({
  bedNo: z.string().min(1, 'Bed number is required'),
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
    const existingBed = await prisma.beds.findFirst({
      where: {
        bedNo: parsedBody.data.bedNo,
        pgId: Number(pgLocationId),
        roomId: parsedBody.data.roomNo,
        id: { not: Number(id) }
      }
    });

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

export const DELETE = async (
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

    // Check if bed is assigned to a tenant
    const existingTenant = await prisma.tenants.findFirst({
      where: {
        bedId: Number(id),
        pgId: Number(pgLocationId),
        isDeleted: false
      }
    });

    if (existingTenant) {
      throw new BadRequestError('Cannot delete. Bed is assigned to a tenant.');
    }

    // Find bed to get roomId
    const bed = await prisma.beds.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        roomId: true
      }
    });

    if (!bed?.roomId) {
      throw new BadRequestError('Bed or associated room not found');
    }

    // Run both operations in a transaction
    await prisma.$transaction([
      prisma.beds.update({
        where: {
          id: Number(id),
          pgId: Number(pgLocationId)
        },
        data: {
          isDeleted: true
        }
      }),
      prisma.rooms.update({
        where: {
          id: bed.roomId,
          pgId: Number(pgLocationId)
        },
        data: {
          bedCount: {
            decrement: 1
          }
        }
      })
    ]);

    return NextResponse.json(
      { status: 200, message: 'Deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
