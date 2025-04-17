'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function SessionExpiryHandler() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.expiryTimestamp) return;

    let secondsLeft = Math.floor((session.expiryTimestamp - Date.now()) / 1000);

    if (secondsLeft <= 0) {
      signOut({ redirect: true, callbackUrl: '/login' });
      return;
    }

    setCountdown(secondsLeft);

    const logoutTimer = setTimeout(() => {
      Cookies.remove('pgLocationId');
      signOut({ redirect: true, callbackUrl: '/login' });
    }, secondsLeft * 1000);

    const countdownInterval = setInterval(() => {
      secondsLeft -= 1;
      setCountdown(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => {
      clearTimeout(logoutTimer);
      clearInterval(countdownInterval);
    };
  }, [session, status]);

  if (countdown !== null && countdown <= 10) {
    return (
      <div className='fixed bottom-4 right-4 z-50 rounded-md bg-red-500 px-4 py-2 text-white shadow-lg'>
        Session expiring in {countdown} seconds
      </div>
    );
  }

  return null;
}
