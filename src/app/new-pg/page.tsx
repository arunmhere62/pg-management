'use client';

import NewPgCreate from '@/components/features/new-pg/NewPgCreate';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function NewPgPage() {
  const handleLogout = () => {
    localStorage.clear();
    document.cookie = 'pgLocationId=; Max-Age=0; path=/';
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT });
  };

  return (
    <div className='flex min-h-screen items-center justify-center py-10 sm:px-6'>
      <div className='w-full rounded-xl border bg-white p-3 sm:max-w-2xl sm:p-8'>
        <h2 className='mb-2 text-3xl font-bold text-gray-800'>
          Welcome! Let’s Get Started 🚀
        </h2>
        <p className='mb-6 text-gray-600'>
          To begin using the application, you need to create your first PG
          location. This will enable you to manage rooms, tenants, rent
          payments, and more.
        </p>

        <NewPgCreate mode='create' />

        <div className='mt-8 border-t pt-6'>
          <p className='mb-4 text-center text-sm text-gray-500'>
            Don’t want to continue right now? You can return to login anytime.
          </p>
          <div className='flex justify-center'>
            <Button
              onClick={handleLogout}
              className='w-[180px] bg-red-500 text-white hover:bg-red-600'
            >
              Go Back To Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
