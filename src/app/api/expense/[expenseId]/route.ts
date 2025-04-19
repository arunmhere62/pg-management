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
  { params }: { params: Promise<{ expenseId: string }> }
) => {
  try {
    const { expenseId } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Selected PG location ');
    }
    const res = await prisma.expenses.findUnique({
      where: {
        id: Number(expenseId),
        isDeleted: false,
        pgId: Number(pgLocationId)
      }
    });
    if (!res) {
      throw new NotFoundError('Expense record not found');
    }
    return NextResponse.json(
      { data: res, message: 'Expense fetched successfully', status: 200 },
      {
        status: 200
      }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const expenseUpdateSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  expenseType: z.string().min(1, 'Expense type is required'),
  paidTo: z.string().min(1, 'Recipient is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  remarks: z.string().optional(),
  paidDate: z
    .string()
    .refine((date) => isoDateRegex.test(date) && !isNaN(Date.parse(date)), {
      message:
        'Invalid Paid date format. Use ISO format: yyyy-MM-ddTHH:mm:ss.sssZ'
    })
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ expenseId: string }> }
) => {
  try {
    const { expenseId } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Selected PG location ');
    }
    const body = await req.json();
    const parsedData = expenseUpdateSchema.safeParse(body);
    if (!parsedData.success) {
      throw new BadRequestError('Invalid request data');
    }

    const { amount, expenseType, paidTo, paymentMethod, remarks, paidDate } =
      parsedData.data;
    const updatedExpense = await prisma.expenses.update({
      where: {
        id: Number(expenseId),
        pgId: Number(pgLocationId)
      },
      data: {
        amount,
        expenseType,
        paidTo,
        paymentMethod,
        remarks,
        paidDate
      }
    });
    return NextResponse.json(
      { message: 'Expense updated successfully', status: 200 },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
