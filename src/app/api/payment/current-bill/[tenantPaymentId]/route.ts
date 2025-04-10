import prisma from '@/lib/prisma';
import {
  BadRequestError,
  errorHandler,
  NotFoundError
} from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const paymentSchema = z.object({
  currentBill: z.number().positive('Current Bill must be greater than zero')
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ tenantPaymentId: string }> }
) => {
  try {
    const { tenantPaymentId } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('PG location data not found in cookies');
    }
    const body = await req.json();
    const validation = paymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }
    const { currentBill } = body;
    const tenant = await prisma.tenant_payments.findUnique({
      where: { id: Number(tenantPaymentId) }
    });

    if (!tenant) {
      throw new NotFoundError('Tenant payment not found');
    }
    await prisma.$transaction([
      prisma.tenant_payments.update({
        where: { id: Number(tenantPaymentId), pgId: Number(pgLocationId) },
        data: {
          currentBill: currentBill
        }
      })
    ]);

    return NextResponse.json(
      { message: 'Current Bill added successfully', status: 200 },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
