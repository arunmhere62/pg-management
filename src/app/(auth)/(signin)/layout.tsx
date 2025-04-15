import AuthGuardWrapper from '@/lib/AuthGuard';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AuthGuardWrapper>{children}</AuthGuardWrapper>;
}
