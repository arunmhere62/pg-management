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
        // Fix: This was not incrementing properly - it was calculating the value but not storing it
        sharingCountMap[key] += 1;
      } else {
        sharingCountMap[key] = 1;
      }
    });

    // Calculate total rooms correctly
    const totalRooms = rooms.length;
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

    // 5️⃣ Calculate net profit (accounting for refunds)
    const refundsByMonth: Record<string, number> = {};

    // Get refunds by month
    const refundPayments = await prisma.refund_payments.findMany({
      where: { pgId: Number(pgLocationId), isDeleted: false },
      select: { amountPaid: true, createdAt: true }
    });

    // Process refunds by month
    for (const refund of refundPayments) {
      const month = formatMonth(refund.createdAt);
      if (!month) continue;
      const amount = Number(refund.amountPaid ?? 0);
      if (!refundsByMonth[month]) {
        refundsByMonth[month] = 0;
      }
      refundsByMonth[month] += amount;
    }

    // Calculate net profit (income - expenses - refunds)
    for (const month in monthlyMap) {
      const summary = monthlyMap[month];
      const monthlyRefunds = refundsByMonth[month] || 0;
      summary.netProfit =
        summary.monthlyIncome - summary.monthlyExpenses - monthlyRefunds;
    }
    const financialOverviewArray = Object.entries(monthlyMap).map(
      ([month, summary]) => ({
        month,
        ...summary
      })
    );
    const occupiedCount = beds.filter((bed) => bed.tenants.length > 0).length;
    const vacantCount = beds.length - occupiedCount;

    // Define date ranges for this month and last month
    const today = new Date();

    // This month (1st day to current day)
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    // Last month (1st day to last day)
    const lastMonth = today.getMonth() - 1;
    const lastMonthYear = today.getFullYear() + (lastMonth < 0 ? -1 : 0);
    const normalizedLastMonth = lastMonth < 0 ? 11 : lastMonth;
    const lastMonthStart = new Date(lastMonthYear, normalizedLastMonth, 1);
    const lastMonthEnd = new Date(
      lastMonthYear,
      normalizedLastMonth + 1,
      0,
      23,
      59,
      59
    );

    console.log(
      'This month date range:',
      thisMonthStart.toISOString(),
      'to',
      thisMonthEnd.toISOString()
    );
    console.log(
      'Last month date range:',
      lastMonthStart.toISOString(),
      'to',
      lastMonthEnd.toISOString()
    );

    // Calculate this month's advances (what the user wants)
    const thisMonthAdvances = advancePayments
      .filter((payment) => {
        if (!payment.paymentDate) return false;
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= thisMonthStart && paymentDate <= thisMonthEnd;
      })
      .reduce((total, payment) => {
        return total + Number(payment.amountPaid || 0);
      }, 0);

    // Keep last month's advances for reference
    const lastMonthAdvances = advancePayments
      .filter((payment) => {
        if (!payment.paymentDate) return false;
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= lastMonthStart && paymentDate <= lastMonthEnd;
      })
      .reduce((total, payment) => {
        return total + Number(payment.amountPaid || 0);
      }, 0);

    // Calculate total advances (all time)
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

    // Get tenants joined in the last month
    const lastMonthJoinedTenants = await prisma.tenants.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        createdAt: true
      }
    });

    // Get recently joined tenants (last 5, regardless of month)
    const recentJoinedTenants = await prisma.tenants.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        createdAt: true
      }
    });

    // We already defined the date range above

    const lastMonthExpenses = await prisma.otherExpenses.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        expenseDate: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      },
      orderBy: {
        expenseDate: 'desc'
      },
      select: {
        id: true,
        amount: true,
        expenseDate: true,
        description: true
      }
    });

    console.log('Found last month expenses:', lastMonthExpenses.length);

    const lastMonthTotalExpenses = lastMonthExpenses.reduce(
      (total, expense) => {
        const amount = Number(expense.amount || 0);
        console.log(
          'Expense amount:',
          amount,
          'Description:',
          expense.description
        );
        return total + amount;
      },
      0
    );

    console.log('Total expenses calculated:', lastMonthTotalExpenses);

    // Prepare tenant activity data
    const tenantActivity = {
      newTenants: newTenantsCount,
      removedTenants: removedTenantsCount,
      totalAdvances: totalAdvances,
      thisMonthAdvances: thisMonthAdvances, // Add this month's advances
      lastMonthAdvances: lastMonthAdvances,
      totalRefunds: Number(totalRefunds._sum?.amountPaid || 0),
      recentRents: recentRentPayments,
      recentAdvances: recentAdvancePayments,
      recentRefunds: recentRefundPayments,
      recentJoinedTenants: recentJoinedTenants,
      lastMonthJoinedTenants: lastMonthJoinedTenants,
      lastMonthExpenses: lastMonthExpenses,
      lastMonthTotalExpenses: lastMonthTotalExpenses
    };

    const summaryCard = {
      totalTenant: totalTenant,
      totalBeds: beds?.length,
      occupiedBeds: occupiedCount,
      availableBeds: vacantCount,
      totalRoomsPrice: totalRoomsPrice,
      roomSharing: sharingCountMap,
      totalRooms: totalRooms // Add the correct total rooms count
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
