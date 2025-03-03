import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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
    const body = await req.json();
    const { data } = body;
    if (
      !data ||
      !data.locationName ||
      !data.images ||
      !Array.isArray(data.images)
    ) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    const newPG = await prisma.pg_locations.create({
      data: {
        userId: Number(userId),
        locationName: data.locationName,
        images: data.images, // ✅ Store images array
        pincode: data.pincode,
        address: data.address,
        cityId: Number(data.city),
        stateId: Number(data.state)
      }
    });
    return NextResponse.json(newPG, { status: 200 });
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      NextResponse.json(
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
