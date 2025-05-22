const MILLILITRES_PER_CUP = 236.588;
const GRAMS_PER_OUNCE = 28.3495;

export function cupsToMillilitres(cups: number): number {
  return cups * MILLILITRES_PER_CUP;
}

export function millilitresToCups(millilitres: number): number {
  return millilitres / MILLILITRES_PER_CUP;
}

// export function cupsToGrams(cups: number, gramsPerCup: number): number {
//     return cups * gramsPerCup;
// }

// export function gramsToCups(grams: number, gramsPerCup: number): number {
//     return grams / gramsPerCup;
// }

export function ouncesToGrams(ounces: number): number {
  return ounces * GRAMS_PER_OUNCE;
}

export function gramsToOunces(grams: number): number {
  return grams / GRAMS_PER_OUNCE;
}

export function numberToFraction(number: number, maxDenominator = 10): string {
  if (!Number.isFinite(number)) {
    return number.toString();
  }

  if (number === Math.floor(number)) {
    return number.toString();
  }

  const sign = number < 0 ? -1 : 1;
  number = Math.abs(number);

  let bestNumerator = 1;
  let bestDenominator = 1;
  let bestError = Math.abs(number - bestNumerator / bestDenominator);

  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    const numerator = Math.round(number * denominator);
    const error = Math.abs(number - numerator / denominator);
    if (error < bestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      bestError = error;
      if (error < 1e-8) break; // good enough
    }
  }

  // Reduce the fraction
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const commonDivisor = gcd(bestNumerator, bestDenominator);
  let numerator = bestNumerator / commonDivisor;
  let denominator = bestDenominator / commonDivisor;

  // Extract whole part if improper fraction
  const whole = Math.floor(numerator / denominator);
  numerator = numerator - whole * denominator;

  let result = '';
  if (whole !== 0) {
    result += (sign * whole).toString();
    if (numerator !== 0) {
      result += ` ${numerator}/${denominator}`;
    }
  } else {
    result = `${sign * numerator}/${denominator}`;
  }
  return result.trim();
}
