'use client';

import { Building, Bed, Users, Home, Layers } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface PropertyDetailsProps {
  totalRooms: number;
  totalBeds: number;
  totalTenants: number;
  roomSharing: Record<string, number>;
  totalRoomsPrice: number;
}

export function PropertyDetails({
  totalRooms,
  totalBeds,
  totalTenants,
  roomSharing,
  totalRoomsPrice
}: PropertyDetailsProps) {
  return (
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
            <span className='font-bold'>{totalRooms || 0}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Bed className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium'>Total Beds</span>
            </div>
            <span className='font-bold'>{totalBeds || 0}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium'>Total Tenants</span>
            </div>
            <span className='font-bold'>{totalTenants || 0}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Home className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium'>Room Types</span>
            </div>
            <div className='text-right'>
              {Object.entries(roomSharing || {}).map(([type, count]) => (
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
              {formatCurrency(totalRoomsPrice || 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
