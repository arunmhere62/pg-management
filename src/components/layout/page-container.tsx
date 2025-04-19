import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className=''>
          <div className=' '>{children}</div>
        </ScrollArea>
      ) : (
        <div className=''>{children}</div>
      )}
    </>
  );
}
