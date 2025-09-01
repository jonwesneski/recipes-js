export const camelCaseToSpaces = (camelCaseString: string): string => {
  if (!camelCaseString) {
    return '';
  }
  // Replace each uppercase letter (except the first character) with a space followed by the letter
  return camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2');
};

export const isoDateToLocale = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  // Format the date to "MM/DD/YYYY"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
