'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';

interface ExpenseItem {
  id: number;
  amount: number;
  type: string;
  paidTo: string;
  date: string | Date;
  paymentMethod: string;
  remarks: string;
}

interface ExpenseDistributionItem {
  type: string;
  amount: number;
  percentage: number;
}

interface ExpensesDisplayProps {
  recentExpenses: ExpenseItem[];
  expenseDistribution: ExpenseDistributionItem[];
  totalExpenses: number;
}

export function ExpensesDisplay({
  recentExpenses,
  expenseDistribution,
  totalExpenses
}: ExpensesDisplayProps) {
  return (
    <Card className=''>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          This month&rsquo;s expense distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Total Expenses:</span>
            <span className='font-bold'>{formatCurrency(totalExpenses)}</span>
          </div>

          {/* Expense Distribution */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium'>Expense Distribution</h3>
            {expenseDistribution.map((item) => (
              <div
                key={item.type}
                className='flex items-center justify-between'
              >
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full bg-primary'></div>
                  <span className='text-sm'>{item.type}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>
                    {formatCurrency(item.amount)}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Expenses */}
          <div className='mt-4'>
            <h3 className='mb-2 text-sm font-medium'>Recent Expenses</h3>
            <ScrollArea className='h-[200px]'>
              <div className='space-y-3'>
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className='rounded-lg border p-3'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>{expense.type}</p>
                        <p className='text-xs text-muted-foreground'>
                          Paid to: {expense.paidTo} •{' '}
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className='font-medium'>
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                    {expense.remarks && (
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Note: {expense.remarks}
                      </p>
                    )}
                  </div>
                ))}
                {(!recentExpenses || recentExpenses.length === 0) && (
                  <p className='py-4 text-center text-muted-foreground'>
                    No recent expenses found
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
