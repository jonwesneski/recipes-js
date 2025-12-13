export const calculatePercentage = (part: number, total: number): string => {
  return `${roundToDecimal((part / total) * 100, 2)}%`;
};

export const roundToDecimal = (num: number, decimalPlaces: number): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
};
