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
  Users,
  CircleDollarSign,
  Receipt,
  CreditCard
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
  totalRooms: number; // Add total rooms property
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
  thisMonthAdvances: number;
  lastMonthAdvances: number;
  totalRefunds: number;
  thisMonthRefunds: number;
  recentRents: ITenantPayment[];
  recentAdvances: any[];
  recentRefunds: any[];
  recentJoinedTenants: {
    id: number;
    name: string;
    email: string;
    phoneNo: string;
    createdAt: string;
  }[];
  lastMonthJoinedTenants: {
    id: number;
    name: string;
    email: string;
    phoneNo: string;
    createdAt: string;
  }[];
  lastMonthExpenses: {
    id: number;
    amount: number;
    paidDate: string;
    expenseType: string;
    paidTo: string;
    remarks: string;
    paymentMethod: string;
  }[];
  thisMonthExpensesDetails: {
    id: number;
    amount: number;
    paidDate: string;
    expenseType: string;
    paidTo: string;
    remarks: string;
    paymentMethod: string;
  }[];
  lastMonthTotalExpenses: number;
  thisMonthRevenue: number;
  thisMonthExpenses: number;
  thisMonthProfit: number;
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
    const totalRevenue = dashboardOverview?.financialOverview?.reduce(
      (sum, item) => sum + item.monthlyIncome,
      0
    );

    // Include refunds in total expenses
    const totalRefunds = dashboardOverview?.tenantActivity?.totalRefunds || 0;
    const totalExpenses =
      (dashboardOverview?.financialOverview?.reduce(
        (sum, item) => sum + item.monthlyExpenses,
        0
      ) || 0) + totalRefunds;

    const totalProfit = dashboardOverview?.financialOverview?.reduce(
      (sum, item) => sum + item.netProfit,
      0
    );

    // This month's data
    const thisMonthRevenue =
      dashboardOverview?.tenantActivity?.thisMonthRevenue || 0;
    const thisMonthExpenses =
      (dashboardOverview?.tenantActivity?.thisMonthExpenses || 0) +
      (dashboardOverview?.tenantActivity?.thisMonthRefunds || 0);
    const thisMonthProfit =
      dashboardOverview?.tenantActivity?.thisMonthProfit || 0;

    // Total PG rooms cost
    const totalRoomsPrice =
      dashboardOverview?.summaryCard?.totalRoomsPrice || 0;

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      thisMonthRevenue,
      thisMonthExpenses,
      thisMonthProfit,
      totalRoomsPrice
    };
  };

  const {
    totalRevenue,
    totalExpenses,
    totalProfit,
    thisMonthRevenue,
    thisMonthExpenses,
    thisMonthProfit,
    totalRoomsPrice
  } = calculateTotals();

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
              <CircleDollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(totalRevenue || 0)}
              </div>
              <div className='mt-2 flex flex-col gap-1'>
                <p className='flex justify-between text-sm text-muted-foreground'>
                  <span>This month:</span>
                  <span className='font-medium'>
                    {formatCurrency(thisMonthRevenue || 0)}
                  </span>
                </p>
                <p className='flex justify-between text-xs text-muted-foreground'>
                  <span>% of PG value:</span>
                  <span className='font-medium'>
                    {totalRoomsPrice
                      ? (
                          ((thisMonthRevenue || 0) / totalRoomsPrice) *
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
              <CardTitle className='text-sm font-medium'>
                Total Expenses
              </CardTitle>
              <Receipt className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(totalExpenses || 0)}
              </div>
              <div className='mt-2 flex flex-col gap-1'>
                <p className='flex justify-between text-sm text-muted-foreground'>
                  <span>This month:</span>
                  <span className='font-medium'>
                    {formatCurrency(thisMonthExpenses || 0)}
                  </span>
                </p>
                <p className='flex justify-between text-xs text-muted-foreground'>
                  <span>Includes refunds:</span>
                  <span className='font-medium'>
                    {formatCurrency(
                      dashboardOverview?.tenantActivity?.thisMonthRefunds || 0
                    )}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Net Profit</CardTitle>
              <CreditCard className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(totalProfit || 0)}
              </div>
              <div className='mt-2 flex flex-col gap-1'>
                <p className='flex justify-between text-sm text-muted-foreground'>
                  <span>This month:</span>
                  <span className='font-medium'>
                    {formatCurrency(thisMonthProfit || 0)}
                  </span>
                </p>
                <p className='flex justify-between text-xs text-muted-foreground'>
                  <span>% of PG value:</span>
                  <span className='font-medium'>
                    {totalRoomsPrice
                      ? (
                          ((thisMonthProfit || 0) / totalRoomsPrice) *
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
                    {dashboardOverview?.summaryCard?.totalRooms || 0}
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
                    <div className='text-sm font-medium'>
                      This Month Advances
                    </div>
                    <div className='mt-2 text-2xl font-bold'>
                      {formatCurrency(
                        dashboardOverview?.tenantActivity?.thisMonthAdvances ||
                          0
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
                        {formatCurrency(
                          dashboardOverview?.tenantActivity
                            ?.thisMonthExpenses || 0
                        )}
                      </span>
                    </div>
                    <ScrollArea className='mt-2 h-[100px]'>
                      {dashboardOverview?.tenantActivity
                        ?.thisMonthExpensesDetails &&
                      dashboardOverview.tenantActivity.thisMonthExpensesDetails
                        .length > 0 ? (
                        // Safe to map since we've checked for existence and length
                        dashboardOverview.tenantActivity.thisMonthExpensesDetails.map(
                          (expense) => (
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
                          )
                        )
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

          {/* Recent Activity Tabs */}
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest transactions and tenant activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='rents'>
                <TabsList className='mb-4'>
                  <TabsTrigger value='rents'>Recent Rents</TabsTrigger>
                  <TabsTrigger value='advances'>Recent Advances</TabsTrigger>
                  <TabsTrigger value='refunds'>Recent Refunds</TabsTrigger>
                  <TabsTrigger value='tenants'>New Tenants</TabsTrigger>
                </TabsList>

                <TabsContent value='rents'>
                  <ScrollArea className='h-[200px]'>
                    <div className='space-y-4'>
                      {dashboardOverview?.tenantActivity?.recentRents?.map(
                        (payment) => (
                          <div
                            key={payment.id}
                            className='flex items-center gap-4'
                          >
                            <Avatar>
                              <AvatarFallback>
                                {payment.tenants.name
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex-1 space-y-1'>
                              <p className='text-sm font-medium leading-none'>
                                {payment.tenants.name}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                {payment.paymentMethod} •{' '}
                                {new Date(
                                  payment.paymentDate
                                ).toLocaleDateString()}
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
                          No recent rent payments found
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value='advances'>
                  <ScrollArea className='h-[200px]'>
                    <div className='space-y-4'>
                      {dashboardOverview?.tenantActivity?.recentAdvances?.map(
                        (advance) => (
                          <div
                            key={advance.id}
                            className='flex items-center gap-4'
                          >
                            <Avatar>
                              <AvatarFallback>
                                {advance.tenants.name
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex-1 space-y-1'>
                              <p className='text-sm font-medium leading-none'>
                                {advance.tenants.name}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                {advance.paymentMethod} •{' '}
                                {new Date(
                                  advance.paymentDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className='flex flex-col items-end'>
                              <p className='text-sm font-medium'>
                                {formatCurrency(advance.amountPaid)}
                              </p>
                              <p className='text-xs text-green-500'>Advance</p>
                            </div>
                          </div>
                        )
                      )}
                      {(!dashboardOverview?.tenantActivity?.recentAdvances ||
                        dashboardOverview.tenantActivity.recentAdvances
                          .length === 0) && (
                        <p className='py-4 text-center text-muted-foreground'>
                          No recent advance payments found
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value='refunds'>
                  <ScrollArea className='h-[200px]'>
                    <div className='space-y-4'>
                      {dashboardOverview?.tenantActivity?.recentRefunds?.map(
                        (refund) => (
                          <div
                            key={refund.id}
                            className='flex items-center gap-4'
                          >
                            <Avatar>
                              <AvatarFallback>
                                {refund.tenants.name
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex-1 space-y-1'>
                              <p className='text-sm font-medium leading-none'>
                                {refund.tenants.name}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                Refund •{' '}
                                {new Date(
                                  refund.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className='flex flex-col items-end'>
                              <p className='text-sm font-medium'>
                                {formatCurrency(refund.amountPaid)}
                              </p>
                              <p className='text-xs text-red-500'>Refund</p>
                            </div>
                          </div>
                        )
                      )}
                      {(!dashboardOverview?.tenantActivity?.recentRefunds ||
                        dashboardOverview.tenantActivity.recentRefunds
                          .length === 0) && (
                        <p className='py-4 text-center text-muted-foreground'>
                          No recent refunds found
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value='tenants'>
                  <ScrollArea className='h-[200px]'>
                    <div className='space-y-4'>
                      <h3 className='text-sm font-medium'>Joined Last Month</h3>
                      {dashboardOverview?.tenantActivity
                        ?.lastMonthJoinedTenants &&
                      dashboardOverview.tenantActivity.lastMonthJoinedTenants
                        .length > 0 ? (
                        // Safe to map since we've checked for existence and length
                        dashboardOverview.tenantActivity.lastMonthJoinedTenants.map(
                          (tenant) => (
                            <div
                              key={tenant.id}
                              className='flex items-center gap-4'
                            >
                              <Avatar>
                                <AvatarFallback>
                                  {tenant.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className='flex-1 space-y-1'>
                                <p className='text-sm font-medium leading-none'>
                                  {tenant.name}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                  {tenant.phoneNo} • Joined{' '}
                                  {new Date(
                                    tenant.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className='flex flex-col items-end'>
                                <p className='text-xs text-green-500'>
                                  Last Month
                                </p>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <p className='py-2 text-center text-xs text-muted-foreground'>
                          No tenants joined last month
                        </p>
                      )}

                      <h3 className='mt-4 text-sm font-medium'>
                        Recently Joined (All)
                      </h3>
                      {dashboardOverview?.tenantActivity?.recentJoinedTenants?.map(
                        (tenant) => (
                          <div
                            key={tenant.id}
                            className='flex items-center gap-4'
                          >
                            <Avatar>
                              <AvatarFallback>
                                {tenant.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex-1 space-y-1'>
                              <p className='text-sm font-medium leading-none'>
                                {tenant.name}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                {tenant.phoneNo} • Joined{' '}
                                {new Date(
                                  tenant.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className='flex flex-col items-end'>
                              <p className='text-xs text-green-500'>
                                New Tenant
                              </p>
                            </div>
                          </div>
                        )
                      )}
                      {(!dashboardOverview?.tenantActivity
                        ?.recentJoinedTenants ||
                        dashboardOverview.tenantActivity.recentJoinedTenants
                          .length === 0) && (
                        <p className='py-4 text-center text-muted-foreground'>
                          No recently joined tenants found
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
