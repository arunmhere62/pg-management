'use client';

import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PgRedirectWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession(); // from NextAuth
  const [loading, setLoading] = useState(true);

  console.log('status', status);

  useEffect(() => {
    if (status === 'loading') return; // wait for session check

    // ✅ Prevent authenticated users from accessing "/" (e.g. login page)
    if (status === 'authenticated' && pathname === '/login') {
      router.replace('/dashboard/overview');
      return;
    }

    // ❌ Redirect unauthenticated users
    if (status === 'unauthenticated' && pathname !== '/login') {
      router.replace('/login');
      return;
    }

    // ✅ pgLocationId check
    const pgLocationId = Cookies.get('pgLocationId');

    if (pathname === '/new-pg') {
      if (pgLocationId) {
        router.replace('/dashboard/overview');
      } else {
        setLoading(false); // allow access to /new-pg if no pgLocationId
      }
    } else {
      if (!pgLocationId && status === 'authenticated') {
        router.replace('/new-pg'); // force user to select pg
      } else {
        setLoading(false);
      }
    }
  }, [pathname, router, status]);

  if (loading) return null;

  return <>{children}</>;
}
