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

interface ExpenseDetail {
  id: number;
  amount: number;
  paidDate: string;
  expenseType: string;
  paidTo: string;
  remarks: string;
  paymentMethod: string;
}

interface TenantActivityProps {
  newTenants: number;
  removedTenants: number;
  thisMonthAdvances: number;
  totalRefunds: number;
  thisMonthExpenses: number;
  thisMonthExpensesDetails: ExpenseDetail[];
}

export function TenantActivity({
  newTenants,
  removedTenants,
  thisMonthAdvances,
  totalRefunds,
  thisMonthExpenses,
  thisMonthExpensesDetails
}: TenantActivityProps) {
  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle>Tenant Activity</CardTitle>
        <CardDescription>Recent tenant movements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='rounded-lg border p-3'>
              <div className='text-sm font-medium'>
                New Tenants (Last 30 days)
              </div>
              <div className='mt-2 text-2xl font-bold'>{newTenants || 0}</div>
            </div>
            <div className='rounded-lg border p-3'>
              <div className='text-sm font-medium'>
                Vacated Tenants (Last 30 days)
              </div>
              <div className='mt-2 text-2xl font-bold'>
                {removedTenants || 0}
              </div>
            </div>
            <div className='rounded-lg border p-3'>
              <div className='text-sm font-medium'>This Month Advances</div>
              <div className='mt-2 text-2xl font-bold'>
                {formatCurrency(thisMonthAdvances || 0)}
              </div>
            </div>
            <div className='rounded-lg border p-3'>
              <div className='text-sm font-medium'>Refunds Processed</div>
              <div className='mt-2 text-2xl font-bold'>
                {formatCurrency(totalRefunds || 0)}
              </div>
            </div>
          </div>

          {/* This Month's Expenses */}
          <div className='mt-6'>
            <h3 className='mb-2 text-sm font-medium'>
              This Month&rsquo;s Expenses
            </h3>
            <div className='rounded-lg border p-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>
                  Total This Month
                </span>
                <span className='font-medium'>
                  {formatCurrency(thisMonthExpenses || 0)}
                </span>
              </div>
              <ScrollArea className='mt-2 h-[100px]'>
                {thisMonthExpensesDetails &&
                thisMonthExpensesDetails.length > 0 ? (
                  thisMonthExpensesDetails.map((expense) => (
                    <div
                      key={expense.id}
                      className='flex items-center justify-between py-1 text-sm'
                    >
                      <span className='text-muted-foreground'>
                        {expense.expenseType ||
                          expense.paidTo ||
                          expense.remarks ||
                          'Expense'}
                      </span>
                      <span>{formatCurrency(expense.amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className='py-2 text-center text-xs text-muted-foreground'>
                    No expenses recorded this month.
                  </p>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
