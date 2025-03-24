import prisma from '@/lib/prisma';
import {
  BadRequestError,
  errorHandler,
  NotFoundError
} from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) => {
  try {
    const { paymentId } = await params;
    console.log('paymentId', paymentId);

    const pgLocationId = req.cookies.get('pgLocationId');
    if (!pgLocationId) {
      throw new BadRequestError('PG location data not found in cookies');
    }
    const res = await prisma.tenant_payments.findUnique({
      where: {
        id: Number(paymentId)
      }
    });
    if (!res) {
      throw new NotFoundError('Payment record not found');
    }
    console.log('payment res data', res);
    return NextResponse.json(res, {
      status: 200
    });
  } catch (error) {
    return errorHandler(error);
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) => {
  try {
    const { paymentId } = await params;
    const body = await req.json();
    const { currentPayment, previousPayment } = body.data;

    if (!currentPayment || !previousPayment) {
      throw new BadRequestError('Invalid payment data');
    }

    console.log('Current Payment:', currentPayment);
    console.log('Previous Payment:', previousPayment);

    const pgLocationId = req.cookies.get('pgLocationId');
    if (!pgLocationId) {
      throw new BadRequestError('PG location data not found in cookies');
    }

    // 1️⃣ Fetch Existing Payment Record
    const tenant = await prisma.tenant_payments.findUnique({
      where: { id: Number(paymentId) }
    });

    if (!tenant) {
      throw new BadRequestError('Tenant payment not found');
    }

    console.log('Existing Tenant Payment:', tenant);

    // ✅ Ensure Required Fields Exist Before Proceeding
    if (
      !tenant.amountPaid ||
      !tenant.bedId ||
      !tenant.roomId ||
      !tenant.tenantId ||
      !tenant.pgId ||
      !tenant.paymentMethod ||
      !tenant.paymentDate ||
      !tenant.status
    ) {
      throw new BadRequestError(
        'Missing required fields in tenant payment data. Cannot store history.'
      );
    }

    // 2️⃣ Use Prisma Transaction for Atomic Updates
    await prisma.$transaction(async (tx) => {
      await tx.tenant_payment_history.create({
        data: {
          tenantPaymentId: tenant.id,
          bedId: tenant.bedId,
          amountPaid: tenant.amountPaid,
          paymentDate: tenant.paymentDate,
          paymentMethod: tenant.paymentMethod,
          status: tenant.status,
          remarks: tenant.remarks ?? ''
        }
      });

      console.log('Previous Payment Stored in History');

      // Update the current tenant payment
      await tx.tenant_payments.update({
        where: { id: Number(paymentId) },
        data: {
          tenantId: currentPayment.tenantId,
          pgId: currentPayment.pgId,
          bedId: currentPayment.bedId,
          roomId: currentPayment.roomId,
          paymentDate: currentPayment.paymentDate,
          startDate: currentPayment.startDate,
          endDate: currentPayment.endDate,
          paymentMethod: currentPayment.paymentMethod,
          status: currentPayment.status,
          remarks: currentPayment.remarks,
          amountPaid: currentPayment.amountPaid
        }
      });

      console.log('Updated Tenant Payment:', currentPayment);
    });

    return NextResponse.json(
      { message: 'Payment updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
