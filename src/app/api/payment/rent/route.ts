import prisma from '@/lib/prisma';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
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
    const res = await prisma.tenant_payments.findMany({
      where: {
        pgId: Number(pgLocationId)
      },
      include: {
        beds: {
          omit: {
            images: true
          }
        },

        pgLocations: true,
        rooms: {
          omit: {
            images: true
          }
        },
        tenants: {
          omit: {
            images: true,
            proofDocuments: true
          }
        }
      }
    });
    return NextResponse.json(
      { data: res, message: 'Tenant Payments fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const paymentSchema = z.object({
  tenantId: z.number().int().positive('Invalid tenant ID'),
  pgId: z.number().int().positive('Invalid PG ID'),
  bedId: z.number().int().positive('Invalid Bed ID'),
  roomId: z.number().int().positive('Invalid Room ID'),
  paymentDate: z
    .string()
    .refine((date) => isoDateRegex.test(date) && !isNaN(Date.parse(date)), {
      message:
        'Invalid payment date format. Use ISO format: yyyy-MM-ddTHH:mm:ss.sssZ'
    }),
  startDate: z
    .string()
    .refine((date) => isoDateRegex.test(date) && !isNaN(Date.parse(date)), {
      message:
        'Invalid start date format. Use ISO format: yyyy-MM-ddTHH:mm:ss.sssZ'
    }),
  endDate: z
    .string()
    .refine((date) => isoDateRegex.test(date) && !isNaN(Date.parse(date)), {
      message:
        'Invalid end date format. Use ISO format: yyyy-MM-ddTHH:mm:ss.sssZ'
    }),
  paymentMethod: z.enum(['GPAY', 'CASH', 'BANK_TRANSFER', 'PHONEPE'], {
    message: 'Invalid payment method'
  }),
  status: z.enum(['PAID', 'PENDING', 'FAILED'], {
    message: 'Invalid status'
  }),
  remarks: z.string().min(1, 'Remarks cannot be empty'),
  amountPaid: z.number().positive('Amount paid must be greater than zero')
});

export const POST = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const body = await req.json();

    const validationResult = paymentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.format()
        },
        { status: 400 }
      );
    }
    const validatedData = validationResult.data;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      return NextResponse.json(
        { error: 'PG location data not found in cookies' },
        { status: 400 }
      );
    }
    const existingPayment = await prisma.tenant_payments.findFirst({
      where: {
        tenantId: validatedData.tenantId,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate
      }
    });

    if (existingPayment) {
      throw new BadRequestError(
        'A payment for this tenant with the same start and end dates already exists'
      );
    }

    const res = await prisma.tenant_payments.create({
      data: {
        pgId: validatedData.pgId,
        bedId: validatedData.bedId,
        roomId: validatedData.roomId,
        tenantId: validatedData.tenantId,
        paymentMethod: validatedData.paymentMethod,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        paymentDate: validatedData.paymentDate,
        amountPaid: validatedData.amountPaid,
        status: validatedData.status,
        remarks: validatedData.remarks
      }
    });
    return NextResponse.json(
      { message: 'Payment recorded successfully', status: 201 },
      { status: 201 }
    );
  } catch (error: any) {
    return errorHandler(error);
  }
};
