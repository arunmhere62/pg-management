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
        error: 'Select PG Location',
        status: 400
      });
    }
    const res = await prisma.otherExpenses.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      }
    });
    return NextResponse.json(
      {
        message: 'Expenses fetched successfully',
        data: res,
        status: 200
      },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const expenseCreateSchema = z.object({
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

export const POST = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Select pg location');
    }
    const body = await req.json();
    const parsedData = expenseCreateSchema.safeParse(body);
    if (!parsedData.success) {
      throw new BadRequestError('Invalid request data');
    }
    const { amount, expenseName, description, expenseDate } = parsedData.data;
    const newExpense = await prisma.otherExpenses.create({
      data: {
        amount,
        expenseName,
        description,
        expenseDate,
        pgId: Number(pgLocationId)
      }
    });
    return NextResponse.json(
      {
        message: 'Expense created successfully',
        data: newExpense,
        status: 201
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
