'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BadgeIndianRupee,
  Bed,
  Building,
  Home,
  IndianRupee,
  Layers,
  Users
} from 'lucide-react';
import { useSelector } from '@/store';
import { useSetBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { fetchDashboardOverview } from '@/services/utils/api/dashboard-api';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialOverview } from './DashboardFinanacialOverview';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';

// Types for our dashboard data
interface IFinancialOverviewProps {
  month: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  netProfit: number;
}

interface ISummaryCardProps {
  totalTenant: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  totalRoomsPrice: number;
  roomSharing: Record<string, number>;
}

interface ITenantPayment {
  id: number;
  tenantId: number;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  tenants: {
    id: number;
    name: string;
    email: string;
    phoneNo: string;
  };
}

interface ITenantActivity {
  newTenants: number;
  removedTenants: number;
  totalAdvances: number;
  totalRefunds: number;
  recentRents: ITenantPayment[];
  recentAdvances: any[];
  recentRefunds: any[];
}

interface IDashboardOverview {
  financialOverview: IFinancialOverviewProps[];
  summaryCard: ISummaryCardProps;
  tenantActivity: ITenantActivity;
}

export default function PGDashboard() {
  const [dashboardOverview, setDashboardOverview] =
    useState<IDashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { pgLocationId } = useSelector((state) => state.pgLocation);

  useSetBreadcrumbs([{ title: 'PG Dashboard', link: '/dashboard/pg' }]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard overview data with enhanced metrics
        const dashboardRes = await fetchDashboardOverview();
        if (dashboardRes.data) {
          setDashboardOverview(dashboardRes.data);
          console.log('Dashboard data:', dashboardRes.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (pgLocationId) {
      fetchData();
    }
  }, [pgLocationId]);

  // Calculate total revenue, expenses, and profit
  const calculateTotals = () => {
    if (
      !dashboardOverview?.financialOverview ||
      dashboardOverview.financialOverview.length === 0
    ) {
      return { totalRevenue: 0, totalExpenses: 0, totalProfit: 0 };
    }

    return dashboardOverview.financialOverview.reduce(
      (acc, curr) => {
        acc.totalRevenue += curr.monthlyIncome;
        acc.totalExpenses += curr.monthlyExpenses;
        acc.totalProfit += curr.netProfit;
        return acc;
      },
      { totalRevenue: 0, totalExpenses: 0, totalProfit: 0 }
    );
  };

  const { totalRevenue, totalExpenses, totalProfit } = calculateTotals();

  // Get the current month's data
  const getCurrentMonthData = () => {
    if (
      !dashboardOverview?.financialOverview ||
      dashboardOverview.financialOverview.length === 0
    ) {
      return null;
    }

    // Sort by month and get the most recent
    const sortedData = [...dashboardOverview.financialOverview].sort(
      (a, b) =>
        new Date(b.month + '-01').getTime() -
        new Date(a.month + '-01').getTime()
    );

    return sortedData[0];
  };

  const currentMonthData = getCurrentMonthData();

  // Calculate occupancy rate
  const occupancyRate = dashboardOverview?.summaryCard
    ? Math.round(
        (dashboardOverview.summaryCard.occupiedBeds /
          dashboardOverview.summaryCard.totalBeds) *
          100
      )
    : 0;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold tracking-tight'>
            PG Management Dashboard
          </h2>
          <div className='flex items-center space-x-2'>
            <Button>Export Report</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <BadgeIndianRupee className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(totalRevenue)}
              </div>
              {currentMonthData && (
                <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <span
                    className={
                      currentMonthData.monthlyIncome > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {currentMonthData.monthlyIncome > 0 ? (
                      <ArrowUp className='h-3 w-3' />
                    ) : (
                      <ArrowDown className='h-3 w-3' />
                    )}
                  </span>
                  {formatCurrency(currentMonthData.monthlyIncome)} this month
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Expenses
              </CardTitle>
              <Activity className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(totalExpenses)}
              </div>
              {currentMonthData && (
                <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <span
                    className={
                      currentMonthData.monthlyExpenses > 0
                        ? 'text-red-500'
                        : 'text-green-500'
                    }
                  >
                    {currentMonthData.monthlyExpenses > 0 ? (
                      <ArrowUp className='h-3 w-3' />
                    ) : (
                      <ArrowDown className='h-3 w-3' />
                    )}
                  </span>
                  {formatCurrency(currentMonthData.monthlyExpenses)} this month
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Net Profit</CardTitle>
              <IndianRupee className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(totalProfit)}
              </div>
              {currentMonthData && (
                <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <span
                    className={
                      currentMonthData.netProfit > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {currentMonthData.netProfit > 0 ? (
                      <ArrowUp className='h-3 w-3' />
                    ) : (
                      <ArrowDown className='h-3 w-3' />
                    )}
                  </span>
                  {formatCurrency(currentMonthData.netProfit)} this month
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Occupancy Rate
              </CardTitle>
              <Bed className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{occupancyRate}%</div>
              <p className='text-xs text-muted-foreground'>
                {dashboardOverview?.summaryCard?.occupiedBeds || 0} of{' '}
                {dashboardOverview?.summaryCard?.totalBeds || 0} beds occupied
              </p>
            </CardContent>
          </Card>
        </div>

        {/* PG Statistics */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          {/* Financial Overview Chart */}
          <div className='col-span-4'>
            <FinancialOverview
              financialOverview={dashboardOverview?.financialOverview || []}
            />
          </div>

          {/* Recent Payments */}
          <Card className='col-span-3'>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest rent payments received</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-[350px]'>
                <div className='space-y-4'>
                  {dashboardOverview?.tenantActivity?.recentRents?.map(
                    (payment) => (
                      <div key={payment.id} className='flex items-center gap-4'>
                        <Avatar>
                          <AvatarFallback>
                            {payment.tenants.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 space-y-1'>
                          <p className='text-sm font-medium leading-none'>
                            {payment.tenants.name}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {payment.paymentMethod} •{' '}
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className='flex flex-col items-end'>
                          <p className='text-sm font-medium'>
                            {formatCurrency(payment.amountPaid)}
                          </p>
                          <p
                            className={`text-xs ${payment.status === 'PAID' ? 'text-green-500' : 'text-amber-500'}`}
                          >
                            {payment.status}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                  {(!dashboardOverview?.tenantActivity?.recentRents ||
                    dashboardOverview.tenantActivity.recentRents.length ===
                      0) && (
                    <p className='py-4 text-center text-muted-foreground'>
                      No recent payments found
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* PG Property Details */}
          <Card className='col-span-3'>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>PG infrastructure statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Building className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>Total Rooms</span>
                  </div>
                  <span className='font-bold'>
                    {Object.values(
                      dashboardOverview?.summaryCard?.roomSharing || {}
                    ).reduce((sum, count) => sum + count, 0)}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Bed className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>Total Beds</span>
                  </div>
                  <span className='font-bold'>
                    {dashboardOverview?.summaryCard?.totalBeds || 0}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>Total Tenants</span>
                  </div>
                  <span className='font-bold'>
                    {dashboardOverview?.summaryCard?.totalTenant || 0}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Home className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>Room Types</span>
                  </div>
                  <div className='text-right'>
                    {Object.entries(
                      dashboardOverview?.summaryCard?.roomSharing || {}
                    ).map(([type, count]) => (
                      <div key={type} className='text-sm'>
                        {type}: <span className='font-medium'>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Layers className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>Total PG Value</span>
                  </div>
                  <span className='font-bold'>
                    {formatCurrency(
                      dashboardOverview?.summaryCard?.totalRoomsPrice || 0
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tenant Activity */}
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
                    <div className='mt-2 text-2xl font-bold'>
                      {dashboardOverview?.tenantActivity?.newTenants || 0}
                    </div>
                  </div>
                  <div className='rounded-lg border p-3'>
                    <div className='text-sm font-medium'>
                      Vacated Tenants (Last 30 days)
                    </div>
                    <div className='mt-2 text-2xl font-bold'>
                      {dashboardOverview?.tenantActivity?.removedTenants || 0}
                    </div>
                  </div>
                  <div className='rounded-lg border p-3'>
                    <div className='text-sm font-medium'>Advance Payments</div>
                    <div className='mt-2 text-2xl font-bold'>
                      {formatCurrency(
                        dashboardOverview?.tenantActivity?.totalAdvances || 0
                      )}
                    </div>
                  </div>
                  <div className='rounded-lg border p-3'>
                    <div className='text-sm font-medium'>Refunds Processed</div>
                    <div className='mt-2 text-2xl font-bold'>
                      {formatCurrency(
                        dashboardOverview?.tenantActivity?.totalRefunds || 0
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
