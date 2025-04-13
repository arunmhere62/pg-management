'use client';

import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function usePgLocationRedirect(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pgLocationId = Cookies.get('pgLocationId');

    if (pathname === '/new-pg') {
      if (pgLocationId) {
        // already selected, redirect immediately
        router.replace('/dashboard/overview');
      } else {
        // let them stay on new-pg
        setLoading(false);
      }
    } else {
      // Any other route is fine, let it load
      setLoading(false);
    }
  }, [pathname, router]);

  return loading;
}
