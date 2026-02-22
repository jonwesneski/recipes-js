import { useCallback, useEffect, useRef, useState } from 'react';

interface IUseDebouncedApiOptions<T> {
  mutateAsync: (_query: string) => Promise<T>;
  delay?: number;
}

export const useDebouncedApi = <T>({
  mutateAsync,
  delay = 500,
}: IUseDebouncedApiOptions<T>) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestCallRef = useRef(0);

  const setQueryAndFetch = useCallback(
    (value: string) => {
      setQuery(value);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (!value) {
        setData(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      const callId = ++latestCallRef.current;

      const fetchData = async () => {
        try {
          const result = await mutateAsync(value);
          if (callId === latestCallRef.current) {
            setData(result);
            setError(null);
          }
        } catch (e) {
          if (callId === latestCallRef.current) {
            setError(e);
          }
        } finally {
          if (callId === latestCallRef.current) {
            setIsLoading(false);
          }
        }
      };

      timerRef.current = setTimeout(() => {
        void fetchData();
      }, delay);
    },
    [mutateAsync, delay],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { query, data, isLoading, error, setQuery: setQueryAndFetch };
};
