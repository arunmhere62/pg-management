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
    const res = await prisma.tenants.update({
      where: { id: Number(id) },
      data: parsedData.data
    });
    return NextResponse.json({
      message: 'Tenant created successfully',
      data: res
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
