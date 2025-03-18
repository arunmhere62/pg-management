import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      return NextResponse.json({
        error: 'PG location data not found in cookies',
        status: 400
      });
    }
    const tenants = await prisma.tenants.findMany({
      where: {
        pgId: Number(pgLocationId)
      }
    });
    return NextResponse.json(tenants, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

const tenantSchema = z.object({
  tenantId: z.string().uuid(),
  pgId: z.number().min(1, 'PG ID is required'),
  bedId: z.number().min(1, 'Bed ID is required'),
  roomId: z.number().min(1, 'Room ID is required'),
  name: z.string().min(1, 'Name is required'),
  phoneNo: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  email: z.string().email('Invalid email format'),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  images: z.array(z.string()).optional(),
  proofDocuments: z.array(z.string()).optional()
});
export const POST = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;

    if (!pgLocationId) {
      return NextResponse.json(
        { error: 'PG location data not found in cookies' },
        { status: 400 }
      );
    }
    const body = await req.json();
    const parsedData = tenantSchema.safeParse(body.data);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsedData.error.format() },
        { status: 400 }
      );
    }
    const { roomId, bedId } = parsedData.data;

    // **Check if a tenant already exists with the same roomId and bedId**
    const existingTenant = await prisma.tenants.findFirst({
      where: { roomId, bedId }
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'A tenant already exists for this Room and Bed' },
        { status: 400 }
      );
    }
    const res = await prisma.tenants.create({
      data: parsedData.data
    });
    return NextResponse.json({
      message: 'Tenant created successfully',
      data: res
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
