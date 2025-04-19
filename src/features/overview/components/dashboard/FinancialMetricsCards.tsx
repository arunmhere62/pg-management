'use client';

import { CircleDollarSign, Receipt, CreditCard, Bed } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface FinancialMetricsCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  thisMonthRevenue: number;
  thisMonthExpenses: number;
  thisMonthProfit: number;
  totalRoomsPrice: number; // Total PG value from summary API
  occupancyRate: number;
  occupiedBeds: number;
  totalBeds: number;
  thisMonthRefunds: number;
  pgValue?: number; // PG value from financial API
  thisMonthEmployeeSalaries?: number; // Employee salaries for current month
  totalEmployeeSalaries?: number; // Total employee salaries
  thisMonthTotalCosts?: number; // Total costs for current month
  totalCosts?: number; // Total costs overall
}

export function FinancialMetricsCards({
  totalRevenue,
  totalExpenses,
  totalProfit,
  thisMonthRevenue,
  thisMonthExpenses,
  thisMonthProfit,
  totalRoomsPrice,
  occupancyRate,
  occupiedBeds,
  totalBeds,
  thisMonthRefunds,
  pgValue,
  thisMonthEmployeeSalaries,
  totalEmployeeSalaries,
  thisMonthTotalCosts,
  totalCosts
}: FinancialMetricsCardsProps) {
  console.log('totalRevenue', totalRevenue);

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Monthly Revenue</CardTitle>
          <CircleDollarSign className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(thisMonthRevenue || 0)}
          </div>
          <div className='mt-2 flex flex-col gap-1'>
            <p className='flex justify-between text-xs text-muted-foreground'>
              <span>Monthly PG value:</span>
              <span className='font-medium'>
                {formatCurrency(pgValue || totalRoomsPrice || 0)}
              </span>
            </p>
            <p className='flex justify-between text-xs text-muted-foreground'>
              <span>% of PG value:</span>
              <span className='font-medium'>
                {pgValue || totalRoomsPrice
                  ? (
                      ((thisMonthRevenue || 0) / (pgValue || totalRoomsPrice)) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Monthly Costs</CardTitle>
          <Receipt className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(thisMonthTotalCosts || thisMonthExpenses || 0)}
          </div>
          <div className='mt-2 flex flex-col gap-1'>
            <p className='flex justify-between text-xs text-muted-foreground'>
              <span>Expenses:</span>
              <span className='font-medium'>
                {formatCurrency(thisMonthExpenses || 0)}
              </span>
            </p>
            <p className='flex justify-between text-xs text-muted-foreground'>
              <span>Refunds:</span>
              <span className='font-medium'>
                {formatCurrency(thisMonthRefunds || 0)}
              </span>
            </p>
            <p className='flex justify-between text-xs text-muted-foreground'>
              <span>Employee Salaries:</span>
              <span className='font-medium'>
                {formatCurrency(thisMonthEmployeeSalaries || 0)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Monthly Profit</CardTitle>
          <CreditCard className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(thisMonthProfit || 0)}
          </div>
          <div className='mt-2 flex flex-col gap-1'>
            <p className='flex justify-between text-xs text-muted-foreground'>
              <span>Revenue - Costs:</span>
              <span className='font-medium'>
                {formatCurrency(thisMonthRevenue || 0)} -{' '}
                {formatCurrency(thisMonthTotalCosts || 0)}
              </span>
            </p>
            <p className='flex justify-between text-xs text-muted-foreground'>
              <span>% of PG value:</span>
              <span className='font-medium'>
                {pgValue || totalRoomsPrice
                  ? (
                      ((thisMonthProfit || 0) / (pgValue || totalRoomsPrice)) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Occupancy Rate</CardTitle>
          <Bed className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{occupancyRate}%</div>
          <p className='text-xs text-muted-foreground'>
            {occupiedBeds || 0} of {totalBeds || 0} beds occupied
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
