import { useEffect, useState } from 'react';

export const useWakeLock = () => {
  const [isWakeLockSupported, setIsWakeLockSupported] =
    useState<boolean>(false);
  const [isWakeLockOn, setIsWakeLockOn] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!('wakeLock' in navigator)) {
      return;
    }

    setIsWakeLockSupported(true);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && isWakeLockOn) {
        void requestWakeLock();
      }
    });

    return () => {
      if (wakeLock) {
        void wakeLock.release();
      }
    };
  }, [isWakeLockOn, wakeLock]);

  const requestWakeLock = async () => {
    try {
      const _wakeLock = await navigator.wakeLock.request('screen');
      setWakeLock(_wakeLock);

      _wakeLock.addEventListener('release', () => {
        setWakeLock(null);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const turnWakeLockOn = async () => {
    await requestWakeLock();
    setIsWakeLockOn(true);
  };

  const turnWakeLockOff = async () => {
    if (wakeLock) {
      await wakeLock.release();
    }
    setIsWakeLockOn(false);
  };

  const toggleWakeLock = async () => {
    if (isWakeLockOn) {
      await turnWakeLockOff();
      return false;
    }
    await turnWakeLockOn();
    return true;
  };

  return {
    isWakeLockSupported,
    isWakeLockOn,
    turnWakeLockOn,
    turnWakeLockOff,
    toggleWakeLock,
  };
};
