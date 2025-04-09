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
    console.log('hello world expense');
    const { expenseId } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Selected PG location ');
    }
    const res = await prisma.otherExpenses.findUnique({
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
  description: z.string().optional(),
  expenseDate: z
    .string()
    .refine((date) => isoDateRegex.test(date) && !isNaN(Date.parse(date)), {
      message:
        'Invalid Expense date format. Use ISO format: yyyy-MM-ddTHH:mm:ss.sssZ'
    }),
  expenseName: z.string().min(1, 'Expense name is required')
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

    const { amount, expenseName, description, expenseDate } = parsedData.data;
    const updatedExpense = await prisma.otherExpenses.update({
      where: {
        id: Number(expenseId),
        pgId: Number(pgLocationId)
      },
      data: {
        amount,
        expenseName,
        description,
        expenseDate
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
