import prisma from '@/lib/prisma';
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
          select: {
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
        rooms: {
          select: {
            roomNo: true
          }
        }
      }
    });

    if (!res) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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

    const { bedId, roomId, status } = parsedData.data;

    // Fetch existing tenant details
    const existingTenant = await prisma.tenants.findUnique({
      where: { id: Number(id) },
      select: { bedId: true, roomId: true }
    });

    if (!existingTenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const previousBedId = existingTenant.bedId;
    const previousRoomId = existingTenant.roomId;

    // Determine the new bed status based on tenant status
    const newBedStatus = status === 'ACTIVE' ? 'OCCUPIED' : 'VACANT';

    console.log('check payload', parsedData.data);

    // Use a transaction to ensure atomic updates
    const updatedTenant = await prisma.$transaction(async (prisma) => {
      // Update the tenant
      const tenant = await prisma.tenants.update({
        where: { id: Number(id) },
        data: parsedData.data
      });

      // Handle bed change logic
      if (previousBedId !== bedId || status) {
        // Mark the previous bed as VACANT if no other tenant is using it
        if (previousBedId !== bedId) {
          const otherTenants = await prisma.tenants.count({
            where: { bedId: previousBedId }
          });

          if (otherTenants === 0) {
            await prisma.beds.update({
              where: { id: Number(previousBedId) },
              data: { status: 'VACANT' }
            });
          }
        }

        // Update the new bed status
        await prisma.beds.update({
          where: { id: bedId },
          data: { status: newBedStatus }
        });
      }

      // Update previous room status if it has become empty
      if (previousRoomId !== roomId) {
        const previousRoomBedCount = await prisma.beds.count({
          where: { roomId: previousRoomId, status: 'OCCUPIED' }
        });

        if (previousRoomBedCount === 0) {
          await prisma.rooms.update({
            where: { id: Number(previousRoomId) },
            data: { status: 'AVAILABLE' }
          });
        }
      }

      // Update new room status if all beds are occupied
      const totalBeds = await prisma.beds.count({ where: { roomId } });
      const occupiedBeds = await prisma.beds.count({
        where: { roomId, status: 'OCCUPIED' }
      });

      if (totalBeds === occupiedBeds) {
        await prisma.rooms.update({
          where: { id: roomId },
          data: { status: 'OCCUPIED' }
        });
      }

      return tenant;
    });

    return NextResponse.json({
      message: 'Tenant updated successfully',
      data: updatedTenant
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
