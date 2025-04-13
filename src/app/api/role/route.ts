import prisma from '@/lib/prisma';
import { ensureAuthenticated } from '@/lib/sessionAuthGuard';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const { error, session } = await ensureAuthenticated();
    const organizationId = session?.organizationId;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) throw new BadRequestError('Select PG location');
    const res = await prisma.roles.findMany({
      where: {
        organizationId: Number(organizationId),
        isDeleted: false
      }
    });
    console.log('res data', res);

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
