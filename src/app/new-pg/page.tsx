'use client';
import NewPgCreate from '@/components/features/new-pg/NewPgCreate';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function NewPgPage() {
  const handleLogout = () => {
    localStorage.clear();
    document.cookie = 'pgLocationId=; Max-Age=0; path=/';
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='grid w-full max-w-5xl grid-cols-1 gap-6 rounded-2xl bg-white p-8 shadow-lg md:grid-cols-2'>
        {/* Left Column: Form */}
        <div>
          <h2 className='mb-2 text-2xl font-semibold'>
            Create a PG to Get Started
          </h2>
          <p className='mb-6 text-sm text-gray-600'>
            You must create a PG location to begin using the application. This
            allows you to manage tenants, rooms, beds, rent payments, and more.
          </p>

          <NewPgCreate mode='create' />
        </div>

        {/* Right Column: Logout Option */}
        <div className='flex flex-col items-center justify-center border-l border-gray-200 pl-6'>
          <p className='mb-4 text-center text-sm text-gray-700'>
            Don’t want to continue? You can go back to login and try again
            later.
          </p>
          <Button onClick={handleLogout} className='w-[150px]'>
            Go Back To Login
          </Button>
        </div>
      </div>
    </div>
  );
}
