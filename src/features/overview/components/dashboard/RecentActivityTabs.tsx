'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';

interface Tenant {
  id: number;
  name: string;
  email: string;
  phoneNo: string;
  createdAt: string;
}

interface TenantPayment {
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

interface Advance {
  id: number;
  tenantId: number;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  tenants: {
    id: number;
    name: string;
    email: string;
    phoneNo: string;
  };
}

interface Refund {
  id: number;
  tenantId: number;
  amountPaid: number;
  createdAt: string;
  tenants: {
    id: number;
    name: string;
    email: string;
    phoneNo: string;
  };
}

interface RecentActivityTabsProps {
  recentRents: TenantPayment[];
  recentAdvances: Advance[];
  recentRefunds: Refund[];
  recentJoinedTenants: Tenant[];
  lastMonthJoinedTenants: Tenant[];
}

export function RecentActivityTabs({
  recentRents,
  recentAdvances,
  recentRefunds,
  recentJoinedTenants,
  lastMonthJoinedTenants
}: RecentActivityTabsProps) {
  return (
    <Card className=''>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest transactions and tenant activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='rents'>
          <TabsList className='mb-4 w-full justify-start gap-1 overflow-x-scroll sm:overflow-hidden'>
            <TabsTrigger className='text-xs sm:text-sm' value='rents'>
              Rents
            </TabsTrigger>
            <TabsTrigger className='text-xs sm:text-sm' value='advances'>
              Advances
            </TabsTrigger>
            <TabsTrigger className='text-xs sm:text-sm' value='refunds'>
              Refunds
            </TabsTrigger>
            <TabsTrigger className='text-xs sm:text-sm' value='tenants'>
              Tenants
            </TabsTrigger>
          </TabsList>

          <TabsContent value='rents'>
            <ScrollArea className='h-[300px]'>
              <div className='space-y-4'>
                {recentRents?.map((payment) => (
                  <div
                    key={payment.id}
                    className='flex items-center gap-2 sm:gap-4'
                  >
                    <Avatar>
                      <AvatarFallback>
                        {payment.tenants.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 space-y-1'>
                      <p className='text-xs font-medium leading-none sm:text-sm'>
                        {payment.tenants.name}
                      </p>
                      <p className='max-w-[120px] truncate text-xs text-muted-foreground sm:max-w-none sm:text-sm'>
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
                ))}
                {(!recentRents || recentRents.length === 0) && (
                  <p className='py-4 text-center text-muted-foreground'>
                    No recent rent payments found
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value='advances'>
            <ScrollArea className='h-[300px]'>
              <div className='space-y-4'>
                {recentAdvances?.map((advance) => (
                  <div
                    key={advance.id}
                    className='flex items-center gap-2 sm:gap-4'
                  >
                    <Avatar>
                      <AvatarFallback>
                        {advance.tenants.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 space-y-1'>
                      <p className='text-xs font-medium leading-none sm:text-sm'>
                        {advance.tenants.name}
                      </p>
                      <p className='max-w-[120px] truncate text-xs text-muted-foreground sm:max-w-none sm:text-sm'>
                        {advance.paymentMethod} •{' '}
                        {new Date(advance.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='flex flex-col items-end'>
                      <p className='text-sm font-medium'>
                        {formatCurrency(advance.amountPaid)}
                      </p>
                      <p className='text-xs text-green-500'>Advance</p>
                    </div>
                  </div>
                ))}
                {(!recentAdvances || recentAdvances.length === 0) && (
                  <p className='py-4 text-center text-muted-foreground'>
                    No recent advance payments found
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value='refunds'>
            <ScrollArea className='h-[300px]'>
              <div className='space-y-4'>
                {recentRefunds?.map((refund) => (
                  <div
                    key={refund.id}
                    className='flex items-center gap-2 sm:gap-4'
                  >
                    <Avatar>
                      <AvatarFallback>
                        {refund.tenants.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 space-y-1'>
                      <p className='text-xs font-medium leading-none sm:text-sm'>
                        {refund.tenants.name}
                      </p>
                      <p className='max-w-[120px] truncate text-xs text-muted-foreground sm:max-w-none sm:text-sm'>
                        Refund •{' '}
                        {new Date(refund.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='flex flex-col items-end'>
                      <p className='text-sm font-medium'>
                        {formatCurrency(refund.amountPaid)}
                      </p>
                      <p className='text-xs text-red-500'>Refund</p>
                    </div>
                  </div>
                ))}
                {(!recentRefunds || recentRefunds.length === 0) && (
                  <p className='py-4 text-center text-muted-foreground'>
                    No recent refunds found
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value='tenants'>
            <ScrollArea className='h-[300px]'>
              <div className='space-y-4'>
                <h3 className='text-sm font-medium'>Recently Joined (All)</h3>
                {recentJoinedTenants?.map((tenant) => (
                  <div
                    key={tenant.id}
                    className='flex items-center gap-2 sm:gap-4'
                  >
                    <Avatar>
                      <AvatarFallback>
                        {tenant.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 space-y-1'>
                      <p className='text-xs font-medium leading-none sm:text-sm'>
                        {tenant.name}
                      </p>
                      <p className='max-w-[120px] truncate text-xs text-muted-foreground sm:max-w-none sm:text-sm'>
                        {tenant.phoneNo} • Joined{' '}
                        {new Date(tenant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='flex flex-col items-end'>
                      <p className='text-xs text-green-500'>New Tenant</p>
                    </div>
                  </div>
                ))}
                {(!recentJoinedTenants || recentJoinedTenants.length === 0) && (
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
  );
}
