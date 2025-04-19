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
  { params }: { params: Promise<{ salaryId: string }> }
) => {
  try {
    const { salaryId } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Selected PG location ');
    }
    const res = await prisma.employeeSalary.findUnique({
      where: {
        id: Number(salaryId),
        isDeleted: false,
        pgId: Number(pgLocationId)
      }
    });
    if (!res) {
      throw new NotFoundError('Salary record not found');
    }
    return NextResponse.json(
      { data: res, message: 'Salary fetched successfully', status: 200 },
      {
        status: 200
      }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const employeeSalaryUpdateSchema = z.object({
  employeeId: z.string().nonempty('Employee ID is required'),
  remarks: z.string().optional(),
  paidDate: z.string().regex(isoDateRegex, 'Invalid date format'),
  paymentMethod: z.enum(['GPAY', 'PHONEPE', 'CASH', 'BANK_TRANSFER']),
  salaryAmount: z.number().min(0, 'Amount must be a positive number'),
  month: z.number().min(1, 'Month is required').max(12, 'Invalid month'),
  year: z.number().min(1, 'Year is required')
});

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ salaryId: string }> }
) => {
  try {
    const { salaryId } = await params;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;

    if (!pgLocationId) {
      throw new BadRequestError('PG location not selected');
    }

    const data = await req.json();

    const parsedData = employeeSalaryUpdateSchema.safeParse(data);
    if (!parsedData.success) {
      throw new BadRequestError('Invalid request data');
    }

    const {
      employeeId,
      remarks,
      paidDate,
      paymentMethod,
      salaryAmount,
      month,
      year
    } = parsedData.data;

    const updatedSalary = await prisma.employeeSalary.update({
      where: {
        id: Number(salaryId),
        isDeleted: false,
        pgId: Number(pgLocationId)
      },
      data: {
        userId: Number(employeeId),
        remarks,
        paidDate,
        paymentMethod,
        salaryAmount,
        month,
        year
      }
    });

    return NextResponse.json(
      {
        message: 'Employee salary updated successfully',
        data: updatedSalary,
        status: 200
      },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ salaryId: string }> }
) => {
  try {
    const { salaryId } = await params;

    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId || !salaryId) {
      throw new BadRequestError('PG location or salary data not found');
    }
    const res = await prisma.employeeSalary.update({
      where: {
        pgId: Number(pgLocationId),
        id: Number(salaryId)
      },
      data: {
        isDeleted: true
      }
    });
    if (!res) {
      throw new NotFoundError('Salary record not found');
    }
    return NextResponse.json(
      {
        data: res,
        message: 'Employee salary deleted successfully',
        status: 200
      },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
