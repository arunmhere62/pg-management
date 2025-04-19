'use client';

import { useEffect, useState } from 'react';
import { useSelector } from '@/store';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialOverview } from '../DashboardFinanacialOverview';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { MonthSelector } from './MonthSelector';

// Import our new modular dashboard components
import {
  FinancialMetricsCards,
  PropertyDetails,
  RecentPayments,
  TenantActivity,
  ExpensesDisplay,
  RecentActivityTabs
} from '.';

// API fetch functions
const fetchFinancialData = async (month?: number, year?: number) => {
  try {
    let url = '/api/dashboard/financial';
    if (month && year) {
      url = `/api/dashboard/financial?month=${month}&year=${year}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch financial data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return null;
  }
};

const fetchSummaryData = async () => {
  try {
    const response = await fetch('/api/dashboard/summary');
    if (!response.ok) throw new Error('Failed to fetch summary data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching summary data:', error);
    return null;
  }
};

const fetchTenantActivityData = async () => {
  try {
    const response = await fetch('/api/dashboard/tenant-activity');
    if (!response.ok) throw new Error('Failed to fetch tenant activity data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tenant activity data:', error);
    return null;
  }
};

const fetchExpensesData = async () => {
  try {
    const response = await fetch('/api/dashboard/expenses');
    if (!response.ok) throw new Error('Failed to fetch expenses data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching expenses data:', error);
    return null;
  }
};

interface DashboardData {
  financial: any;
  summary: any;
  tenantActivity: any;
  expenses: any;
}

const PgDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    financial: null,
    summary: null,
    tenantActivity: null,
    expenses: null
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { pgLocationId } = useSelector((state) => state.pgLocation);

  useSetBreadcrumbs([{ title: 'PG Dashboard', link: '/dashboard/pg' }]);

  // Handle month selection change
  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [financialData, summaryData, tenantActivityData, expensesData] =
          await Promise.all([
            fetchFinancialData(selectedMonth, selectedYear),
            fetchSummaryData(),
            fetchTenantActivityData(),
            fetchExpensesData()
          ]);
        console.log('tenantActivityData', tenantActivityData);

        // Combine all data for the dashboard
        setDashboardData({
          financial: financialData,
          summary: summaryData,
          tenantActivity: tenantActivityData,
          expenses: expensesData
        });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (pgLocationId) {
      fetchAllData();
    }
  }, [pgLocationId, selectedMonth, selectedYear]);
  console.log('dashboard financial', dashboardData.financial);
  console.log('dashboard recent', dashboardData.tenantActivity);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        {/* Month Selector */}
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>Financial Dashboard</h2>
          <MonthSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
          />
        </div>
        {/* Key Metrics */}
        <FinancialMetricsCards
          totalRevenue={dashboardData.financial?.totals?.revenue || 0}
          totalExpenses={dashboardData.financial?.totals?.expenses || 0}
          totalProfit={dashboardData.financial?.totals?.profit || 0}
          thisMonthRevenue={
            dashboardData.financial?.selectedMonth?.revenue || 0
          }
          thisMonthExpenses={
            dashboardData.financial?.selectedMonth?.expenses || 0
          }
          thisMonthProfit={dashboardData.financial?.selectedMonth?.profit || 0}
          totalRoomsPrice={
            dashboardData.summary?.propertyStats?.totalRoomsPrice || 0
          }
          occupancyRate={
            dashboardData.summary?.propertyStats?.occupancyRate || 0
          }
          occupiedBeds={dashboardData.summary?.propertyStats?.occupiedBeds || 0}
          totalBeds={dashboardData.summary?.propertyStats?.totalBeds || 0}
          thisMonthRefunds={
            dashboardData.financial?.selectedMonth?.refunds || 0
          }
          pgValue={dashboardData.financial?.totals?.pgValue || 0}
          thisMonthEmployeeSalaries={
            dashboardData.financial?.selectedMonth?.employeeSalaries || 0
          }
          totalEmployeeSalaries={
            dashboardData.financial?.totals?.employeeSalaries || 0
          }
          thisMonthTotalCosts={
            dashboardData.financial?.selectedMonth?.totalCosts || 0
          }
          totalCosts={dashboardData.financial?.totals?.totalCosts || 0}
        />

        {/* PG Statistics */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          {/* Financial Overview Chart */}
          <div className='col-span-4'>
            <FinancialOverview
              financialOverview={
                dashboardData.financial?.financialOverview || []
              }
            />
          </div>

          {/* Recent Payments */}
          <RecentPayments
            recentPayments={dashboardData.tenantActivity?.recentPayments || []}
          />
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          {/* Property Details */}
          <PropertyDetails
            totalRooms={dashboardData.summary?.propertyStats?.totalRooms || 0}
            totalBeds={dashboardData.summary?.propertyStats?.totalBeds || 0}
            totalTenants={
              dashboardData.summary?.propertyStats?.totalTenants || 0
            }
            roomSharing={
              dashboardData.summary?.propertyStats?.roomSharing || {}
            }
            totalRoomsPrice={
              dashboardData.summary?.propertyStats?.totalRoomsPrice || 0
            }
          />

          {/* Tenant Activity */}
          <TenantActivity
            newTenants={dashboardData.tenantActivity?.newTenants || 0}
            removedTenants={dashboardData.tenantActivity?.removedTenants || 0}
            thisMonthAdvances={
              dashboardData.tenantActivity?.thisMonthAdvances || 0
            }
            totalRefunds={dashboardData.financial?.totals?.refunds || 0}
            thisMonthExpenses={dashboardData.expenses?.totalExpenses || 0}
            thisMonthExpensesDetails={
              dashboardData.expenses?.recentExpenses || []
            }
          />
        </div>
        {/* // i want 6 col 6 col */}
        <div className='grid-col-1 grid gap-4 lg:grid-cols-2'>
          {/* Expenses Display */}
          <ExpensesDisplay
            recentExpenses={dashboardData.expenses?.recentExpenses || []}
            expenseDistribution={
              dashboardData.expenses?.expenseDistribution || []
            }
            totalExpenses={dashboardData.expenses?.totalExpenses || 0}
          />

          {/* Recent Activity Tabs */}
          <RecentActivityTabs
            recentRents={dashboardData.tenantActivity?.recentRents || []}
            recentAdvances={dashboardData.tenantActivity?.recentAdvances || []}
            recentRefunds={dashboardData.tenantActivity?.recentRefunds || []}
            recentJoinedTenants={
              dashboardData.tenantActivity?.recentJoinedTenants || []
            }
            lastMonthJoinedTenants={
              dashboardData.tenantActivity?.lastMonthJoinedTenants || []
            }
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default PgDashboard;
