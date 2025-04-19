import prisma from '@/lib/prisma';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to format month
const formatMonth = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) throw new BadRequestError('Select PG Location');

    // Get query parameters for month and year
    const url = new URL(req.url);
    const monthParam = url.searchParams.get('month');
    const yearParam = url.searchParams.get('year');

    // Get current date
    const currentDate = new Date();
    // Use provided month/year or default to current month/year
    const selectedMonth = monthParam
      ? parseInt(monthParam)
      : currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const selectedYear = yearParam
      ? parseInt(yearParam)
      : currentDate.getFullYear();

    // Get all rent payments, expenses, and refunds
    const [rentPayments, expenses, refundPayments] = await Promise.all([
      prisma.tenant_payments.findMany({
        where: { pgId: Number(pgLocationId), isDeleted: false },
        select: { amountPaid: true, paymentDate: true }
      }),
      prisma.expenses.findMany({
        where: { pgId: Number(pgLocationId), isDeleted: false },
        select: { amount: true, paidDate: true }
      }),
      prisma.refund_payments.findMany({
        where: { pgId: Number(pgLocationId), isDeleted: false },
        select: { amountPaid: true, createdAt: true }
      })
    ]);

    // Group by month
    const monthlyMap: Record<
      string,
      { monthlyIncome: number; monthlyExpenses: number; netProfit: number }
    > = {};

    // Process rent payments
    for (const payment of rentPayments) {
      const month = formatMonth(payment.paymentDate);
      if (!month) continue;
      const amount = Number(payment.amountPaid ?? 0);
      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          monthlyIncome: 0,
          monthlyExpenses: 0,
          netProfit: 0
        };
      }
      monthlyMap[month].monthlyIncome += amount;
    }

    // Process expenses
    for (const exp of expenses) {
      const month = formatMonth(exp.paidDate);
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

    // Calculate refunds by month
    const refundsByMonth: Record<string, number> = {};

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

    // Convert to array format for easier consumption by frontend
    const financialOverviewArray = Object.entries(monthlyMap).map(
      ([month, summary]) => ({
        month,
        ...summary
      })
    );

    // Calculate this month's data
    const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth, 0);

    // Get refunds for the selected month
    const thisMonthRefundsData = await prisma.refund_payments.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        paymentDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Calculate this month's refunds
    const thisMonthRefunds = thisMonthRefundsData.reduce((total, refund) => {
      return total + Number(refund.amountPaid || 0);
    }, 0);

    // Get rent payments for the selected month
    const thisMonthRentPayments = await prisma.tenant_payments.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        paymentDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Calculate this month's revenue
    const thisMonthRevenue = thisMonthRentPayments.reduce((total, payment) => {
      return total + Number(payment.amountPaid || 0);
    }, 0);

    // Get expenses for the selected month
    const thisMonthExpenses = await prisma.expenses.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        paidDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Calculate this month's expenses
    const thisMonthTotalExpenses = thisMonthExpenses.reduce(
      (total, expense) => {
        return total + Number(expense.amount || 0);
      },
      0
    );

    // Calculate this month's profit
    const thisMonthProfit =
      thisMonthRevenue - thisMonthTotalExpenses - thisMonthRefunds;

    // Get total refunds
    const totalRefunds = await prisma.refund_payments.aggregate({
      where: { pgId: Number(pgLocationId), isDeleted: false },
      _sum: {
        amountPaid: true
      }
    });

    // Get employee salaries for the selected month
    const employeeSalaries = await prisma.employeeSalary.findMany({
      where: {
        pgId: Number(pgLocationId),
        month: selectedMonth,
        year: selectedYear,
        isDeleted: false
      }
    });

    // Calculate total employee salaries for this month
    const thisMonthEmployeeSalaries = employeeSalaries.reduce(
      (total, salary) => {
        return total + Number(salary.salaryAmount || 0);
      },
      0
    );

    // Get all employee salaries (total)
    const allEmployeeSalaries = await prisma.employeeSalary.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      }
    });

    // Calculate total employee salaries (all time)
    const totalEmployeeSalaries = allEmployeeSalaries.reduce(
      (total, salary) => {
        return total + Number(salary.salaryAmount || 0);
      },
      0
    );

    // Calculate total revenue from all rent payments
    const totalRevenue = rentPayments.reduce((total, payment) => {
      return total + Number(payment.amountPaid || 0);
    }, 0);

    // Calculate total expenses from all expenses (excluding employee salaries)
    const totalExpenses = expenses.reduce((total, expense) => {
      return total + Number(expense.amount || 0);
    }, 0);

    // Calculate total refunds amount
    const totalRefundsAmount = Number(totalRefunds._sum?.amountPaid || 0);

    // Calculate total costs (expenses + refunds + employee salaries)
    const totalCosts =
      totalExpenses + totalRefundsAmount + totalEmployeeSalaries;

    // Calculate total profit (revenue - all costs)
    const totalProfit = totalRevenue - totalCosts;

    // Calculate this month's total costs (expenses + refunds + employee salaries)
    const thisMonthTotalCosts =
      thisMonthTotalExpenses + thisMonthRefunds + thisMonthEmployeeSalaries;

    // Recalculate this month's profit with employee salaries included
    const thisMonthAdjustedProfit = thisMonthRevenue - thisMonthTotalCosts;

    // Get total PG value (sum of all room rents multiplied by beds)
    const rooms = await prisma.rooms.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      select: {
        id: true,
        rentPrice: true,
        _count: {
          select: {
            beds: true
          }
        }
      }
    });

    // Calculate total PG value (potential monthly revenue from all rooms based on beds)
    const totalPGValue = rooms.reduce((total, room) => {
      // Get the number of beds in this room
      const bedCount = room._count.beds;
      // Multiply room rent by number of beds
      return total + Number(room.rentPrice || 0) * bedCount;
    }, 0);
    return NextResponse.json({
      financialOverview: financialOverviewArray,
      selectedMonth: {
        month: selectedMonth,
        year: selectedYear,
        revenue: thisMonthRevenue,
        expenses: thisMonthTotalExpenses,
        refunds: thisMonthRefunds,
        employeeSalaries: thisMonthEmployeeSalaries,
        totalCosts: thisMonthTotalCosts,
        profit: thisMonthAdjustedProfit
      },
      totals: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        refunds: totalRefundsAmount,
        employeeSalaries: totalEmployeeSalaries,
        totalCosts: totalCosts,
        profit: totalProfit,
        pgValue: totalPGValue
      }
    });
  } catch (error) {
    return errorHandler(error);
  }
};
