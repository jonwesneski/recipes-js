export const camelCaseToSpaces = (camelCaseString: string): string => {
  if (!camelCaseString) {
    return '';
  }
  // Replace each uppercase letter (except the first character) with a space followed by the letter
  return camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2');
};
