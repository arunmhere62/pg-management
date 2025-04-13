import prisma from '@/lib/prisma';
import { ensureAuthenticated } from '@/lib/sessionAuthGuard';
import {
  BadRequestError,
  errorHandler,
  NotFoundError
} from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) => {
  try {
    const { employeeId } = await params;
    console.log('hello world expense');
    const { error, session } = await ensureAuthenticated();
    const organizationId = session?.organizationId;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Selected PG location ');
    }
    const res = await prisma.users.findUnique({
      where: {
        id: Number(employeeId),
        organizationId: Number(organizationId)
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

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) => {
  try {
    const { employeeId } = await params;
    const { error, session } = await ensureAuthenticated();
    const organizationId = session?.organizationId;
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Selected PG location missing');
    }

    const body = await req.json();

    const updateSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      phone: z.string().min(10, 'Phone number is required'),
      roleId: z.number().positive('Role is required'),
      status: z.enum(['ACTIVE', 'INACTIVE'], {
        required_error: 'Status is required'
      })
    });

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.message);
    }

    const updatedEmployee = await prisma.users.update({
      where: {
        id: Number(employeeId),
        organizationId: Number(organizationId)
      },
      data: {
        ...parsed.data,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      {
        data: updatedEmployee,
        message: 'Employee updated successfully',
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
  { params }: { params: Promise<{ employeeId: string }> }
) => {
  try {
    const { employeeId } = await params;
    const { error, session } = await ensureAuthenticated();
    const pgLocationId = req.cookies.get('pgLocationId')?.value;

    if (!pgLocationId) {
      throw new BadRequestError('PG location data not found');
    }
    if (!employeeId) {
      throw new BadRequestError('Employee is required');
    }
    const res = await prisma.users.update({
      where: {
        id: Number(employeeId),
        organizationId: Number(session?.organizationId)
      },
      data: {
        isDeleted: true
      }
    });
    return NextResponse.json(
      { status: 200, message: 'Deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
