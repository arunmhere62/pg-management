import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ensureAuthenticated } from '@/lib/sessionAuthGuard';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const { error, session } = await ensureAuthenticated();
    const organizationId = session?.organizationId;

    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) throw new BadRequestError('Select pg location');
    const res = await prisma.users.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        roleId: true,
        pgId: true,
        roles: {
          select: {
            roleName: true,
            id: true
          }
        }
      }
    });
    return NextResponse.json(
      {
        message: 'Employees fetched successfully',
        data: res,
        status: 200
      },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};

const employeeCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  roleId: z.number().positive('Role ID must be a positive number'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  stateId: z.number().positive('Invalid state ID'),
  cityId: z.number().positive('Invalid city ID'),
  pincode: z.string().optional(),
  address: z.string().optional(),
  profileImages: z.array(z.string()).optional(),
  proofDocuments: z.array(z.string()).optional(),
  gender: z.enum(['MALE', 'FEMALE'], {
    required_error: 'Gender is required'
  })
});
export const POST = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;

    const { error, session } = await ensureAuthenticated();

    const organizationId = session?.organizationId;
    if (!pgLocationId || !organizationId) {
      throw new BadRequestError('Select PG Location or organization');
    }

    const body = await req.json();
    const parsedData = employeeCreateSchema.safeParse(body);
    if (!parsedData.success) {
      throw new BadRequestError(parsedData.error.message);
    }

    const {
      name,
      email,
      password,
      phone,
      roleId,
      status,
      cityId,
      stateId,
      pincode,
      address,
      profileImages,
      proofDocuments,
      gender
    } = parsedData.data;

    const newEmployee = await prisma.users.create({
      data: {
        name,
        email,
        password,
        phone,
        roleId,
        status,
        cityId,
        stateId,
        pincode,
        address,
        profileImages,
        proofDocuments,
        gender,
        organizationId: Number(organizationId),
        pgId: Number(pgLocationId)
      }
    });

    return NextResponse.json(
      {
        message: 'Employee created successfully',
        data: newEmployee,
        status: 201
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
