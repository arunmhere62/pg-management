import prisma from '@/lib/prisma';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';

const formatMonth = (date: Date | null) => {
  if (!date) return null;
  return dayjs(date).format('YYYY-MM');
};

type MonthlySummary = {
  monthlyIncome: number;
  monthlyExpenses: number;
  netProfit: number;
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
    const [rentPayments, advancePayments, expenses] = await Promise.all([
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
      summaryCard: summaryCard
    };

    return NextResponse.json({ data: result, status: 200, message: 'Success' });
  } catch (error) {
    return errorHandler(error);
  }
};

// {
//     "dashboard": {
//       "summaryCards": [
//         {
//           "title": "Total Tenants",
//           "value": 120,
//         },
//         {
//           "title": "Occupied Beds",
//           "value": 115,
//         },
//         {
//           "title": "Available Beds",
//           "value": 15,
//         },
//         {
//           "title": "Total Employees",
//           "value": 10,
//         }
//       ],
//       "financialOverview": {
//         "monthlyIncome": 250000,
//         "monthlyExpenses": 150000,
//         "netProfit": 100000,
//       },
//       "recentJoins": [
//         {
//           "tenantName": "John Doe",
//           "activity": "Checked In",
//           "date": "2025-04-04",
//           "roomNo": "A-201",
//           "bedNo": "B-01"
//         },
//         {
//           "tenantName": "Jane Smith",
//           "activity": "Checked Out",
//           "date": "2025-04-03",
//           "roomNo": "B-102",
//           "bedNo": "B-03"
//         }
//       ],
//       "expensesBreakdown": [
//         {
//           "expenseType": "Utilities",
//           "amount": 50000
//         },
//         {
//           "expenseType": "Maintenance",
//           "amount": 30000
//         },
//         {
//           "expenseType": "Salary",
//           "amount": 70000
//         }
//       ],
//       "alerts": [
//         {
//           "type": "Pending Payments",
//           "count": 12
//         },
//         {
//           "type": "Upcoming Check-outs",
//           "count": 5
//         }
//       ]
//     }
//   }
