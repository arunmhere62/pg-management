'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';

export function Breadcrumbs() {
  const items = useSelector((state: RootState) => state.breadcrumb.items);
  const router = useRouter();

  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink
                    asChild
                    className='cursor-pointer'
                    onClick={() => router.push(item.link || '/')}
                  >
                    <span>{item.title}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block'>
                  <Slash />
                </BreadcrumbSeparator>
              </>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
