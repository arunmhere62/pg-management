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
  { params }: { params: Promise<{ refundId: string }> }
) => {
  try {
    const { refundId } = await params;
    const pgLocationId = req.cookies.get('pgLocationId');
    if (!pgLocationId) {
      throw new BadRequestError('PG location data not found in cookies');
    }
    const res = await prisma.refund_payments.findUnique({
      where: {
        id: Number(refundId)
      }
    });
    if (!res) {
      throw new NotFoundError('Payment record not found');
    }
    return NextResponse.json(
      { data: res, message: 'Rent Payment fetched successfully', status: 200 },
      {
        status: 200
      }
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
  paymentMethod: z.enum(['GPAY', 'CASH', 'BANK_TRANSFER', 'PHONEPE'], {
    message: 'Invalid payment method'
  }),
  status: z.enum(['PAID', 'PENDING', 'FAILED'], {
    message: 'Invalid status'
  }),
  remarks: z.string().min(1, 'Remarks cannot be empty'),
  amountPaid: z.number().positive('Amount paid must be greater than zero')
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ refundId: string }> }
) => {
  try {
    const { refundId } = await params;
    const body = await req.json();
    const validation = paymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const pgLocationId = req.cookies.get('pgLocationId');
    if (!pgLocationId) {
      throw new BadRequestError('PG location data not found in cookies');
    }

    // ✅ Prisma Transaction to Ensure Atomic Updates
    await prisma.$transaction([
      prisma.refund_payments.update({
        where: { id: Number(refundId) },
        data: {
          tenantId: validation.data.tenantId,
          pgId: validation.data.pgId,
          bedId: validation.data.bedId,
          roomId: validation.data.roomId,
          paymentDate: validation.data.paymentDate,
          paymentMethod: validation.data.paymentMethod,
          status: validation.data.status,
          remarks: validation.data.remarks,
          amountPaid: validation.data.amountPaid
        }
      })
    ]);

    return NextResponse.json(
      { message: 'Payment updated successfully', status: 200 },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
