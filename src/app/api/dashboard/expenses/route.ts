import prisma from '@/lib/prisma';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) throw new BadRequestError('Select PG Location');

    // Get current month's expenses
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Fetch expenses for the current month
    const expenses = await prisma.expenses.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        paidDate: {
          gte: thisMonthStart,
          lte: thisMonthEnd
        }
      },
      select: {
        id: true,
        amount: true,
        expenseType: true,
        paidTo: true,
        paymentMethod: true,
        remarks: true,
        paidDate: true,
        createdAt: true
      },
      orderBy: {
        paidDate: 'desc'
      }
    });

    // Group expenses by type
    const expensesByType: Record<string, number> = {};
    let totalExpenses = 0;

    for (const expense of expenses) {
      const expenseType = expense.expenseType || 'Other';
      const amount = Number(expense.amount || 0);

      if (!expensesByType[expenseType]) {
        expensesByType[expenseType] = 0;
      }

      expensesByType[expenseType] += amount;
      totalExpenses += amount;
    }

    // Convert to array format for easier consumption by frontend
    const expenseDistribution = Object.entries(expensesByType).map(
      ([type, amount]) => ({
        type,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      })
    );

    // Get recent expenses for display
    const recentExpenses = expenses.slice(0, 5).map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      type: expense.expenseType || 'Other',
      paidTo: expense.paidTo || '',
      date: expense.paidDate,
      paymentMethod: expense.paymentMethod || '',
      remarks: expense.remarks || ''
    }));

    return NextResponse.json({
      expenseDistribution,
      recentExpenses,
      totalExpenses
    });
  } catch (error) {
    return errorHandler(error);
  }
};
