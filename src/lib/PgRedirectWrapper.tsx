'use client';

import { usePgLocationRedirect } from '@/hooks/use-pgLoactionRedirect';

export default function PgRedirectWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const loading = usePgLocationRedirect();

  if (loading) return null;

  return <>{children}</>;
}
