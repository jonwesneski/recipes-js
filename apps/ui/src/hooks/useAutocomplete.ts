import { useMutation } from '@tanstack/react-query';

const fetchAutocomplete = async (query: string): Promise<string[]> => {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/api/autocomplete?${params.toString()}`);
  if (!response.ok) throw new Error('Autocomplete request failed');

  return (await response.json()) as unknown as string[];
};

export const useAutocomplete = () => {
  return useMutation({
    mutationFn: fetchAutocomplete,
  });
};
