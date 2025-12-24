import { useEffect, useState } from 'react';

export const breakpointPxs = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const useMediaQuery = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const updateMediaQueries = () => {
      setWidth(window.innerWidth);
    };

    updateMediaQueries();

    window.addEventListener('resize', updateMediaQueries);

    return () => {
      window.removeEventListener('resize', updateMediaQueries);
    };
  }, []);

  return {
    width,
    breakpointPxs,
  };
};
