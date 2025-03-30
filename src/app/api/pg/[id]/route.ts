import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import {
  BadRequestError,
  errorHandler,
  NotFoundError
} from '@/services/utils/error';
import { z } from 'zod';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    if (!id) {
      throw new BadRequestError('Id not found');
    }
    const pgLocation = await prisma.pg_locations.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!pgLocation) {
      throw new NotFoundError('pg Location not found');
    }
    return NextResponse.json(
      { data: pgLocation, message: 'Pg Locations fetched successful' },
      { status: 200 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};

const pgLocationSchema = z.object({
  locationName: z.string().min(1, 'Location name is required'),
  images: z.array(z.string()).nonempty('At least one image is required'),
  address: z.string().min(1, 'Address is required'),
  pincode: z.string().min(4, 'Pincode must be at least 4 characters'),
  stateId: z.number().positive('Invalid state ID'),
  cityId: z.number().positive('Invalid city ID')
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = pgLocationSchema.parse(body);
    const updatedPG = await prisma.pg_locations.update({
      where: {
        id: Number(id)
      },
      data: {
        ...validatedData
      }
    });
    return NextResponse.json(
      { message: 'PG updated successfully', data: updatedPG },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
