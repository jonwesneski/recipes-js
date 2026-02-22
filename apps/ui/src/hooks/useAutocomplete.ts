import { useMutation } from '@tanstack/react-query';

interface IAutocompleteWord {
  word: string;
  score: number;
  tags?: string[];
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- I may want to comeback to this
const fetchAutocompleteDatamuse = async (query: string): Promise<string[]> => {
  if (!process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL) {
    throw new Error('Autocomplete URL is not defined');
  }
  const url = new URL(process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL);
  url.searchParams.set('sp', `${query}*`);
  url.searchParams.set('ml', 'recipes+food+food products+cooking+ingredient');
  url.searchParams.set('max', '4');

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Autocomplete request failed');

  const data = (await response.json()) as unknown as IAutocompleteWord[];
  return data.map((item) => item.word);
};

const fetchAutocompleteSpoontacular = async (
  query: string,
): Promise<string[]> => {
  if (!process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL) {
    throw new Error('Autocomplete URL is not defined');
  }
  const url = new URL(process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL);
  url.searchParams.set('query', query);
  url.searchParams.set('metaInformation', 'false');
  url.searchParams.set('number', '4');

  const response = await fetch(url.toString(), {
    headers: {
      'x-api-key':
        process.env.NEXT_PUBLIC_AUTOCOMPLETE_SPOONTACULAR_API_KEY ?? '',
    },
  });
  if (!response.ok) throw new Error('Autocomplete request failed');

  const data = (await response.json()) as unknown as { name: string }[];
  return data.map((item) => item.name);
};

export const useAutocomplete = () => {
  return useMutation({
    mutationFn: fetchAutocompleteSpoontacular,
  });
};
