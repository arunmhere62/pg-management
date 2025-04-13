import prisma from '@/lib/prisma';
import { ensureAuthenticated } from '@/lib/sessionAuthGuard';
import {
  BadRequestError,
  errorHandler,
  UnauthorizedError
} from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(3, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) => {
  try {
    const { employeeId } = await params;
    const { error, session } = await ensureAuthenticated();
    if (!session?.organizationId)
      throw new BadRequestError('Organization not found');
    const pgLocationId = req.cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      throw new BadRequestError('Select PG location');
    }

    const body = await req.json();
    const parsedData = passwordUpdateSchema.safeParse(body);
    if (!parsedData.success) {
      throw new BadRequestError('Invalid request data');
    }

    const { currentPassword, newPassword } = parsedData.data;

    const user = await prisma.users.findUnique({
      where: {
        id: Number(employeeId),
        organizationId: Number(session?.organizationId)
      }
    });

    if (!user) throw new BadRequestError('Employee not found');
    if (user.password !== currentPassword) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    await prisma.users.update({
      where: {
        id: Number(employeeId),
        organizationId: Number(session?.organizationId)
      },
      data: {
        password: newPassword
      }
    });

    return NextResponse.json(
      { message: 'Password updated successfully', status: 200 },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
