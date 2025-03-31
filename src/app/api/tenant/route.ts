import prisma from '@/lib/prisma';
import { AppError, ConflictError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      return NextResponse.json({
        error: 'Select PG Location',
        status: 400
      });
    }
    const tenants = await prisma.tenants.findMany({
      where: {
        pgId: Number(pgLocationId)
      },
      select: {
        id: true,
        tenantId: true,
        name: true,
        email: true,
        phoneNo: true,
        status: true,
        pgId: true,
        roomId: true,
        checkInDate: true,
        checkOutDate: true,
        createdAt: true,
        updatedAt: true,
        images: false,
        rooms: {
          select: {
            id: true,
            roomNo: true,
            roomId: true,
            rentPrice: true,
            images: false
          }
        },
        beds: {
          select: {
            id: true,
            bedNo: true,
            images: false
          }
        }
      }
    });
    return NextResponse.json(
      {
        message: 'Visitors fetched successfully',
        data: tenants,
        status: 200
      },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
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
  checkOutDate: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  images: z.array(z.string()).optional(),
  proofDocuments: z.array(z.string()).optional()
});

export const POST = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new AppError(
        'PG location data not found in cookies',
        400,
        'PG_LOCATION_MISSING'
      );
    }
    const body = await req.json();
    const parsedData = tenantSchema.safeParse(body);
    console.log('parsed data', parsedData);

    if (!parsedData.success) {
      throw new AppError('Invalid request data', 400, 'VALIDATION_ERROR');
    }
    const { roomId, bedId } = parsedData.data;
    // Check if a tenant already exists for the given bed
    const existingTenant = await prisma.tenants.findFirst({
      where: { roomId, bedId }
    });
    if (existingTenant) {
      throw new ConflictError('A tenant already exists for this Room and Bed');
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.tenants.create({
        data: parsedData.data
      });
    });
    return NextResponse.json(
      { message: 'Tenant created successfully', status: 201 },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
