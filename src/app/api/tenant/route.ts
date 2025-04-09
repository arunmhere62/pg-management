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
    const searchParams = req.nextUrl.searchParams;
    const isDeletedParam = searchParams.get('isDeleted');
    const isDeleted =
      isDeletedParam === 'true'
        ? true
        : isDeletedParam === 'false'
          ? false
          : undefined;

    const whereCondition: any = {
      pgId: Number(pgLocationId)
    };

    if (typeof isDeleted === 'boolean') {
      whereCondition.isDeleted = isDeleted;
    }
    const tenants = await prisma.tenants.findMany({
      where: whereCondition,
      select: {
        id: true,
        tenantId: true,
        name: true,
        email: true,
        phoneNo: true,
        status: true,
        pgId: true,
        roomId: true,
        tenantAddress: true,
        occupation: true,
        checkInDate: true,
        checkOutDate: true,
        createdAt: true,
        updatedAt: true,
        rooms: {
          select: {
            id: true,
            roomNo: true,
            rentPrice: true
          }
        },
        beds: {
          select: {
            id: true,
            bedNo: true
          }
        },
        tenantPayments: {
          where: {
            isDeleted: false
          },
          orderBy: {
            paymentDate: 'desc'
          },
          take: 1,
          select: {
            paymentDate: true,
            amountPaid: true,
            startDate: true,
            endDate: true
          }
        },
        advancePayments: {
          where: {
            isDeleted: false
          },
          orderBy: {
            paymentDate: 'desc'
          },
          take: 1,
          select: {
            paymentDate: true,
            amountPaid: true
          }
        }
      }
    });
    const formattedTenants = tenants.map((tenant) => {
      const now = new Date();
      const today = new Date(now.toISOString().split('T')[0]); // today's date at midnight (yyyy-mm-dd)

      const lastRentPayment =
        tenant.tenantPayments.length > 0 ? tenant.tenantPayments[0] : null;
      const lastAdvancePayment =
        tenant.advancePayments.length > 0 ? tenant.advancePayments[0] : null;

      let isRentPaid = false;
      let isAdvancePaid = false;

      // Rent payment check
      if (lastRentPayment?.startDate && lastRentPayment?.endDate) {
        const startDate = new Date(
          new Date(lastRentPayment.startDate).toISOString().split('T')[0]
        );
        const endDate = new Date(
          new Date(lastRentPayment.endDate).toISOString().split('T')[0]
        );

        isRentPaid = startDate <= today && today <= endDate;
      }

      // Advance payment check
      if (
        lastAdvancePayment?.paymentDate &&
        lastAdvancePayment.amountPaid != null
      ) {
        const paymentDate = new Date(lastAdvancePayment.paymentDate);
        const amountPaid = Number(lastAdvancePayment.amountPaid);

        // Advance payment is considered paid if it's been paid and the payment date is valid (not in future)
        isAdvancePaid =
          !isNaN(amountPaid) && amountPaid > 0 && paymentDate <= today;
      }

      // Format Check-in Date (DD-MM-YYYY → YYYY-MM-DD)
      let formattedCheckInDate = tenant.checkInDate;
      if (formattedCheckInDate.includes('-')) {
        const [day, month, year] = formattedCheckInDate.split('-');
        formattedCheckInDate = `${year}-${month}-${day}`;
      }

      return {
        ...tenant,
        checkInDate: formattedCheckInDate,
        isRentPaid,
        isAdvancePaid
      };
    });

    return NextResponse.json(
      {
        message: 'Tenants fetched successfully',
        data: formattedTenants,
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
  tenantAddress: z.string().optional(),
  occupation: z.string().optional(),
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
    if (!parsedData.success) {
      throw new AppError('Invalid request data', 400, 'VALIDATION_ERROR');
    }
    const { roomId, bedId } = parsedData.data;
    const existingTenant = await prisma.tenants.findFirst({
      where: {
        roomId,
        bedId,
        isDeleted: false
      }
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
