import prisma from '@/lib/prisma';
import {
  BadRequestError,
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
      return NextResponse.json({ error: 'Id is required' }, { status: 400 });
    }
    const res = await prisma.tenants.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        beds: {
          select: {
            bedNo: true
          }
        },
        tenantPayments: {
          where: {
            isDeleted: false
          },
          select: {
            id: true,
            amountPaid: true,
            paymentDate: true,
            paymentMethod: true,
            status: true,
            startDate: true,
            endDate: true,
            remarks: true,
            tenantPaymentHistory: {
              select: {
                amountPaid: true,
                paymentDate: true,
                paymentMethod: true,
                status: true,
                remarks: true
              }
            }
          }
        },
        advancePayments: {
          where: {
            isDeleted: false
          },
          select: {
            id: true,
            amountPaid: true,
            paymentDate: true,
            paymentMethod: true,
            status: true,
            remarks: true,
            createdAt: true,
            updatedAt: true
          }
        },
        refundPayments: {
          where: {
            isDeleted: false
          },
          select: {
            id: true,
            amountPaid: true,
            paymentDate: true,
            paymentMethod: true,
            status: true,
            remarks: true,
            createdAt: true,
            updatedAt: true
          }
        },
        rooms: {
          where: {
            isDeleted: false
          },
          select: {
            roomNo: true
          }
        }
      }
    });

    if (!res) {
      throw new NotFoundError('Tenant not found');
    }
    return NextResponse.json(
      { data: res, message: 'Fetched the tenant successfully' },
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
  checkOutDate: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  images: z.array(z.string()).optional(),
  proofDocuments: z.array(z.string()).optional()
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Id is required' }, { status: 400 });
    }
    if (!pgLocationId) {
      return NextResponse.json(
        { error: 'Select pg location' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsedData = tenantSchema.safeParse(body);

    // Check if the bed exists
    const bed = await prisma.beds.findUnique({
      where: {
        pgId: Number(parsedData.data?.pgId),
        isDeleted: false,
        id: Number(parsedData.data?.bedId)
      }
    });

    if (!bed) {
      throw new NotFoundError('Bed not found');
    }

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsedData.error.format() },
        { status: 400 }
      );
    }
    // Fetch existing tenant details
    const existingTenant = await prisma.tenants.findUnique({
      where: { id: Number(id) },
      select: { bedId: true, roomId: true }
    });

    if (!existingTenant) {
      throw new NotFoundError('tenant not found');
    }

    const occupiedBed = await prisma.tenants.findFirst({
      where: {
        bedId: Number(parsedData.data?.bedId),
        pgId: Number(pgLocationId),
        isDeleted: false,
        id: { not: Number(id) }
      }
    });

    if (occupiedBed) {
      throw new BadRequestError('Bed is already occupied');
    }
    // Use a transaction to ensure atomic updates
    const updatedTenant = await prisma.$transaction(async (prisma) => {
      const tenant = await prisma.tenants.update({
        where: { id: Number(id), isDeleted: false },
        data: parsedData.data
      });

      return tenant;
    });

    return NextResponse.json(
      {
        message: 'Tenant updated successfully',
        data: updatedTenant,
        status: 200
      },
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
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    const { id } = await params;

    if (!id) {
      throw new BadRequestError('Id is required');
    }
    if (!pgLocationId) {
      throw new BadRequestError('Select pg location');
    }
    const result = await prisma.tenants.update({
      where: {
        pgId: Number(pgLocationId),
        id: Number(id)
      },
      data: {
        isDeleted: true
      }
    });
    if (!result) {
      throw new NotFoundError('Tenant not found');
    }

    return NextResponse.json(
      {
        data: result,
        status: 200,
        message: 'Tenant removed successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
