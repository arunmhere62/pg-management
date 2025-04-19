import prisma from '@/lib/prisma';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) throw new BadRequestError('Select PG Location');

    // Get recent tenant activity (new tenants, payments, etc.)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    const startOfLastMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1
    );
    const endOfLastMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0
    );

    // Get all recently joined tenants
    const recentJoinedTenants = await prisma.tenants.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Get tenants who joined last month specifically
    const lastMonthJoinedTenants = await prisma.tenants.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Get recent rent payments from tenant_payments table
    const recentRents = await prisma.tenant_payments.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        tenants: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Get recent advances from the dedicated advance_payments table
    const recentAdvances = await prisma.advance_payments.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        tenants: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Get recent refunds from the dedicated refund_payments table
    const recentRefunds = await prisma.refund_payments.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        tenants: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Get recent payments for the RecentPayments component
    const recentPayments = await prisma.tenant_payments.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        tenants: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Calculate new and removed tenants for this month
    const newTenants = await prisma.tenants.count({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1)
        }
      }
    });

    const removedTenants = await prisma.tenants.count({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: true,
        updatedAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1)
        }
      }
    });

    // Calculate total advances for this month from the dedicated advance_payments table
    const thisMonthAdvances = await prisma.advance_payments.aggregate({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1)
        }
      },
      _sum: {
        amountPaid: true
      }
    });

    return NextResponse.json({
      recentRents,
      recentAdvances,
      recentRefunds,
      recentJoinedTenants,
      lastMonthJoinedTenants,
      recentPayments,
      newTenants,
      removedTenants,
      thisMonthAdvances: Number(thisMonthAdvances._sum?.amountPaid || 0)
    });
  } catch (error) {
    return errorHandler(error);
  }
};
