import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

    const userId = session.user.id;
    const organizationId = session.organizationId;
    const body = await req.json();
    const validatedData = pgLocationSchema.parse(body);

    // 1. Create the PG
    const newPG = await prisma.pg_locations.create({
      data: {
        userId: Number(userId),
        organizationId: Number(organizationId),
        ...validatedData
      }
    });

    // 2. Update the user's pgLocationId
    await prisma.users.update({
      where: { id: Number(userId) },
      data: { pgId: newPG.id }
    });

    // 3. Fetch updated user details
    const updatedUser = await prisma.users.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        pgId: true,
        pgLocations: {
          select: {
            id: true,
            locationName: true,
            images: true,
            address: true,
            pincode: true,
            stateId: true,
            cityId: true
          }
        }
      }
    });
    const response = NextResponse.json(
      {
        data: updatedUser,
        message: 'PG created and user updated',
        status: 201
      },
      { status: 201 }
    );

    // Set a frontend-readable cookie
    response.cookies.set('pgLocationId', String(newPG.id), {
      httpOnly: false, // frontend can read it
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // optional: 30 days
    });

    return response;
  } catch (error: any) {
    return errorHandler(error);
  }
};
