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
    const res = await prisma.employeeSalary.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      select: {
        id: true,
        userId: true,
        salaryAmount: true,
        month: true,
        year: true,
        paidDate: true,
        paymentMethod: true,
        remarks: true,
        createdAt: true,
        updatedAt: true,
        pgId: true,
        users: {
          select: {
            address: true,
            createdAt: true,
            email: true,
            gender: true,
            id: true,
            name: true,
            phone: true,
            updatedAt: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: 'Employee salaries fetched successfully',
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

const employeeSalaryCreateSchema = z.object({
  employeeId: z.string().nonempty('Employee ID is required'),
  remarks: z.string().optional(),
  paidDate: z.string().regex(isoDateRegex, 'Invalid date format'),
  paymentMethod: z.enum(['GPAY', 'PHONEPE', 'CASH', 'BANK_TRANSFER']),
  salaryAmount: z.number().min(0, 'Amount must be a positive number'),
  month: z.number().min(1, 'Month is required').max(12, 'Invalid month'),
  year: z.number().min(1, 'Year is required')
});

export const POST = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Select pg location');
    }
    const body = await req.json();
    const parsedData = employeeSalaryCreateSchema.safeParse(body);
    if (!parsedData.success) {
      throw new BadRequestError('Invalid request data');
    }
    const {
      employeeId,
      salaryAmount,
      paymentMethod,
      remarks,
      paidDate,
      month,
      year
    } = parsedData.data;
    const res = await prisma.employeeSalary.create({
      data: {
        salaryAmount: salaryAmount,
        userId: Number(employeeId),
        pgId: Number(pgLocationId),
        month: month,
        year: year,
        paymentMethod: paymentMethod,
        remarks: remarks,
        paidDate: paidDate
      }
    });
    return NextResponse.json(
      {
        message: 'Employee salary created successfully',
        data: res,
        status: 201
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
