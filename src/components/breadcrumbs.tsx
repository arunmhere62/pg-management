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
    <Breadcrumb className=''>
      <BreadcrumbList>
        {items?.map((item: any, index: any) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className='cursor-pointer select-none'
                    onClick={() => router.push(item.link || '/')}
                  >
                    <span>{item.title}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
              </>
            )}

            {index === items.length - 1 && (
              <BreadcrumbPage className='select-none'>
                {item.title}
              </BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
