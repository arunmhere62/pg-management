'use client';

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
}

interface TenantPayment {
  id: number;
  tenantId: number;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  tenants: Tenant;
}

interface RecentPaymentsProps {
  recentPayments: TenantPayment[];
}

export function RecentPayments({ recentPayments }: RecentPaymentsProps) {
  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
        <CardDescription>Latest rent payments received</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[350px]'>
          <div className='space-y-4'>
            {recentPayments?.map((payment) => (
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
            ))}
            {(!recentPayments || recentPayments.length === 0) && (
              <p className='py-4 text-center text-muted-foreground'>
                No recent payments found
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
