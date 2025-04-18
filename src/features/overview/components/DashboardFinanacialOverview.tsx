'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { IFinancialOverviewProps } from './overview';

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))'
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))'
  },
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

interface IFinancialOverviewParentProps {
  financialOverview: IFinancialOverviewProps[];
}

export function FinancialOverview({
  financialOverview
}: IFinancialOverviewParentProps) {
  // transform data and sort chronologically (oldest to newest)
  const chartData = financialOverview
    .map((item) => ({
      month: new Date(item.month + '-01').toLocaleString('default', {
        month: 'short'
      }), // "2025-04" → "Apr"
      // Store original date for sorting
      originalDate: new Date(item.month + '-01'),
      income: item.monthlyIncome,
      expenses: item.monthlyExpenses,
      profit: item.netProfit
    }))
    // Sort by date (oldest first)
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime());
  const hasData = chartData.length > 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Income vs Expenses vs Profit</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='min-h-[270px]'>
          {hasData ? (
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator='dashed' />}
                />
                <Bar dataKey='income' fill='var(--color-income)' radius={4} />
                <Bar
                  dataKey='expenses'
                  fill='var(--color-expenses)'
                  radius={4}
                />
                <Bar dataKey='profit' fill='var(--color-profit)' radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className='py-10 text-center text-muted-foreground'>
              No financial data found
            </div>
          )}
        </div>
      </CardContent>
      {hasData && (
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          <div className='flex gap-2 font-medium leading-none'>
            Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
          </div>
          <div className='leading-none text-muted-foreground'>
            Showing financials for recent months
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
