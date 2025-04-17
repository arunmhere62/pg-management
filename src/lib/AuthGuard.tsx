'use client';

import { useSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PgRedirectWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { pgLocationId } = useSelector((state) => state.pgLocation);
  const { data: session, status } = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session && pathname !== '/login') {
      router.replace('/login');
      return;
    }

    if (session && !pgLocationId && pathname !== '/new-pg') {
      router.replace('/new-pg');
      return;
    }

    if (
      session &&
      pgLocationId &&
      (pathname === '/login' || pathname === '/new-pg')
    ) {
      router.replace('/dashboard/overview');
      return;
    }

    setReady(true);
  }, [session, status, pgLocationId, pathname, router]);

  if (!ready) return null;

  return <>{children}</>;
}
