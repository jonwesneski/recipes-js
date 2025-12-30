'use client';

import { useEffect, useState } from 'react';

export const breakpointPxs = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const useMediaQuery = () => {
  const getCurrentWidth = () =>
    typeof window !== 'undefined'
      ? (window.visualViewport?.width ?? window.innerWidth)
      : breakpointPxs.md;

  const [width, setWidth] = useState<number>(getCurrentWidth);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMediaQueries = () => {
      setWidth(getCurrentWidth());
    };

    updateMediaQueries();

    window.addEventListener('resize', updateMediaQueries);
    window.addEventListener('orientationchange', updateMediaQueries);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateMediaQueries);
    }

    return () => {
      window.removeEventListener('resize', updateMediaQueries);
      window.removeEventListener('orientationchange', updateMediaQueries);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateMediaQueries);
      }
    };
  }, []);

  return {
    width,
    breakpointPxs,
  };
};
