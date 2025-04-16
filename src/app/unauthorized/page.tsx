import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className='container flex h-screen w-screen items-center justify-center'>
      <Card className='w-[400px]'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-8 w-8 text-destructive' />
            <CardTitle>Unauthorized Access</CardTitle>
          </div>
          <CardDescription>
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex justify-center'>
            <Button asChild>
              <Link href='/dashboard/overview'>Return to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
