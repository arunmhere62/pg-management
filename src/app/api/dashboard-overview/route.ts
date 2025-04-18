import prisma from '@/lib/prisma';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';

const formatMonth = (date: Date | null) => {
  if (!date) return null;
  return dayjs(date).format('YYYY-MM');
};

type MonthlySummary = {
  monthlyIncome: number;
  monthlyExpenses: number;
  netProfit: number;
};

type RecentPayment = {
  id: number;
  tenantId: number;
  amountPaid: number;
  paymentDate: Date;
  paymentMethod: string;
  status: string;
  tenants: {
    id: number;
    name: string;
    phoneNumber: string;
  };
};

type TenantActivity = {
  newTenants: number;
  removedTenants: number;
  totalAdvances: number;
  totalRefunds: number;
  recentRents: RecentPayment[];
  recentAdvances: any[];
  recentRefunds: any[];
};
export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) throw new BadRequestError('Select PG Location');
    const totalTenant = await prisma.tenants.count({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      }
    });
    const beds = await prisma.beds.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      select: {
        id: true,
        bedNo: true,
        images: false,
        pgId: true,
        roomId: true,
        createdAt: true,
        updatedAt: true,
        rooms: {
          select: {
            roomId: true,
            roomNo: true
          }
        },
        tenants: {
          where: {
            isDeleted: false
          },
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    const rooms = await prisma.rooms.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      select: {
        id: true,
        rentPrice: true,
        beds: {
          where: {
            isDeleted: false
          },
          select: {
            id: true
          }
        }
      }
    });

    const sharingCountMap: Record<string, number> = {};
    rooms?.forEach((room) => {
      const sharing = room.beds.length;
      const key = `${sharing} Sharing`;
      if (sharingCountMap[key]) {
        sharingCountMap[key] + 1;
      } else {
        sharingCountMap[key] = 1;
      }
    });
    const totalRoomsPrice = rooms.reduce((total, room) => {
      const bedCount = room.beds.length;
      const roomRent = Number(room.rentPrice ?? 0);
      return total + bedCount * roomRent;
    }, 0);

    const monthlyMap: Record<string, MonthlySummary> = {};

    // 1️⃣ Fetch all data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      rentPayments,
      advancePayments,
      expenses,
      recentRentPayments,
      recentAdvancePayments,
      recentRefundPayments,
      newTenantsCount,
      removedTenantsCount
    ] = await Promise.all([
      prisma.tenant_payments.findMany({
        where: { pgId: Number(pgLocationId), isDeleted: false },
        select: { amountPaid: true, paymentDate: true }
      }),
      prisma.advance_payments.findMany({
        where: { pgId: Number(pgLocationId), isDeleted: false },
        select: { amountPaid: true, paymentDate: true }
      }),
      prisma.otherExpenses.findMany({
        where: { pgId: Number(pgLocationId), isDeleted: false },
        select: { amount: true, expenseDate: true }
      }),
      // Recent rent payments (last 5)
      prisma.tenant_payments.findMany({
        where: { pgId: Number(pgLocationId), isDeleted: false },
        orderBy: { paymentDate: 'desc' },
        take: 5,
        include: {
          tenants: {
            select: {
              id: true,
              name: true,
              // Use fields that exist in your schema
              email: true,
              phoneNo: true
            }
          }
        }
      }),
      // Recent advance payments (last 5)
      prisma.advance_payments.findMany({
        where: { pgId: Number(pgLocationId), isDeleted: false },
        orderBy: { paymentDate: 'desc' },
        take: 5,
        include: {
          tenants: {
            select: {
              id: true,
              name: true,
              // Use fields that exist in your schema
              email: true,
              phoneNo: true
            }
          }
        }
      }),
      // Recent refund payments (last 5)
      prisma.refund_payments.findMany({
        where: { pgId: Number(pgLocationId), isDeleted: false },
        // Use a field that exists in your schema
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          tenants: {
            select: {
              id: true,
              name: true,
              // Use fields that exist in your schema
              email: true,
              phoneNo: true
            }
          }
        }
      }),
      // New tenants in last 30 days
      prisma.tenants.count({
        where: {
          pgId: Number(pgLocationId),
          isDeleted: false,
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      // Removed tenants in last 30 days
      prisma.tenants.count({
        where: {
          pgId: Number(pgLocationId),
          isDeleted: true,
          updatedAt: {
            gte: thirtyDaysAgo
          }
        }
      })
    ]);

    // 2️⃣ Process rent payments
    for (const rent of rentPayments) {
      const month = formatMonth(rent.paymentDate);
      if (!month) continue;
      const amount = Number(rent.amountPaid ?? 0);
      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          monthlyIncome: 0,
          monthlyExpenses: 0,
          netProfit: 0
        };
      }
      monthlyMap[month].monthlyIncome += amount;
    }

    // 3️⃣ Process advance payments
    for (const adv of advancePayments) {
      const month = formatMonth(adv.paymentDate);
      if (!month) continue;
      const amount = Number(adv.amountPaid ?? 0);
      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          monthlyIncome: 0,
          monthlyExpenses: 0,
          netProfit: 0
        };
      }
      monthlyMap[month].monthlyIncome += amount;
    }

    // 4️⃣ Process expenses
    for (const exp of expenses) {
      const month = formatMonth(exp.expenseDate);
      if (!month) continue;
      const amount = Number(exp.amount ?? 0);
      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          monthlyIncome: 0,
          monthlyExpenses: 0,
          netProfit: 0
        };
      }
      monthlyMap[month].monthlyExpenses += amount;
    }

    // 5️⃣ Calculate net profit
    for (const month in monthlyMap) {
      const summary = monthlyMap[month];
      summary.netProfit = summary.monthlyIncome - summary.monthlyExpenses;
    }
    const financialOverviewArray = Object.entries(monthlyMap).map(
      ([month, summary]) => ({
        month,
        ...summary
      })
    );
    const occupiedCount = beds.filter((bed) => bed.tenants.length > 0).length;
    const vacantCount = beds.length - occupiedCount;

    // Calculate total advances and refunds
    const totalAdvances = advancePayments.reduce((total, payment) => {
      return total + Number(payment.amountPaid || 0);
    }, 0);

    const totalRefunds = await prisma.refund_payments.aggregate({
      where: { pgId: Number(pgLocationId), isDeleted: false },
      _sum: {
        // Use a field that exists in your schema
        amountPaid: true
      }
    });

    // Prepare tenant activity data
    const tenantActivity = {
      newTenants: newTenantsCount,
      removedTenants: removedTenantsCount,
      totalAdvances: totalAdvances,
      totalRefunds: Number(totalRefunds._sum?.amountPaid || 0),
      recentRents: recentRentPayments,
      recentAdvances: recentAdvancePayments,
      recentRefunds: recentRefundPayments
    };

    const summaryCard = {
      totalTenant: totalTenant,
      totalBeds: beds?.length,
      occupiedBeds: occupiedCount,
      availableBeds: vacantCount,
      totalRoomsPrice: totalRoomsPrice,
      roomSharing: sharingCountMap
    };

    const result = {
      financialOverview: financialOverviewArray,
      summaryCard: summaryCard,
      tenantActivity: tenantActivity
    };

    return NextResponse.json({ data: result, status: 200, message: 'Success' });
  } catch (error) {
    return errorHandler(error);
  }
};
