'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function SessionExpiryHandler() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [expiryTime, setExpiryTime] = useState<number>(30); // Default to 30 seconds

  // Fetch the session expiry time from the API
  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const fetchExpiryTime = async () => {
      try {
        const response = await fetch('/api/session/expiry');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.expirySeconds) {
            setExpiryTime(data.expirySeconds);
            console.log(
              `Got session expiry time from API: ${data.expirySeconds} seconds`
            );
          }
        }
      } catch (error) {
        console.error('Error fetching session expiry time:', error);
      }
    };

    fetchExpiryTime();
  }, [session, status]);

  // Handle the countdown and auto-logout
  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    let secondsLeft = expiryTime;
    console.log(`Session will expire in ${secondsLeft} seconds`);

    // Set a timeout to automatically log out after session expires
    const logoutTimer = setTimeout(async () => {
      Cookies.remove('pgLocationId');
      await signOut({ redirect: true, callbackUrl: '/login' });
    }, secondsLeft * 1000);

    // Show countdown to user
    setCountdown(secondsLeft);

    const countdownInterval = setInterval(() => {
      secondsLeft -= 1;
      setCountdown(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(logoutTimer);
      clearInterval(countdownInterval);
    };
  }, [session, status, expiryTime]); // Re-run when session, status, or expiryTime changes

  // Only show countdown if less than 10 seconds remaining
  if (countdown !== null && countdown <= 10) {
    return (
      <div className='fixed bottom-4 right-4 z-50 rounded-md bg-red-500 px-4 py-2 text-white shadow-lg'>
        Session expiring in {countdown} seconds
      </div>
    );
  }

  return null;
}
