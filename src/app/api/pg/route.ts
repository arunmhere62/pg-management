import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // ✅ Correctly import `auth` from your auth config
import { getPgListService } from './service';
import prisma from '@/lib/prisma';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { z } from 'zod';

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    const userId = session?.user.id;
    const organizationId = session?.organizationId;

    if (!userId || !organizationId) {
      throw new BadRequestError('User ID or organization not found in session');
    }
    const pgList = await getPgListService(
      Number(userId),
      Number(organizationId)
    );
    return NextResponse.json(
      {
        data: pgList,
        status: 200,
        message: 'pg location list fetched successfully'
      },
      { status: 200 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};

//

const pgLocationSchema = z.object({
  locationName: z.string().min(1, 'Location name is required'),
  images: z.array(z.string()).nonempty('At least one image is required'),
  address: z.string().min(1, 'Address is required'),
  pincode: z.string().min(4, 'Pincode must be at least 4 characters'),
  stateId: z.number().positive('Invalid state ID'),
  cityId: z.number().positive('Invalid city ID')
});

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    const userId = session?.user.id;
    const organizationId = session?.organizationId;
    const body = await req.json();
    const validatedData = pgLocationSchema.parse(body);

    const newPG = await prisma.pg_locations.create({
      data: {
        userId: Number(userId),
        organizationId: Number(organizationId),
        ...validatedData
      }
    });
    return NextResponse.json(
      { data: newPG, message: 'created successfully', status: 201 },
      { status: 201 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};
