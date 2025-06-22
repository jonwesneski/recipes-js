import { IngredientEntityUnit } from '@repo/recipes-codegen/models';

export const measurementUnits = Object.keys(IngredientEntityUnit);
export const measurementUnitsAbbreviated: Record<IngredientEntityUnit, string> =
  {
    cups: 'cups',
    tablespoons: 'tbs',
    teaspoons: 'tsp',
    ounces: 'oz',
    pounds: 'lbs',
    fluidOunces: 'fl oz',
    pints: 'pt',
    quarts: 'qt',
    gallons: 'gal',
    grams: 'g',
    kilograms: 'kg',
    milliliters: 'ml',
    liters: 'L',
    whole: 'whole',
  };
export const measurementUnitsSingular: Record<IngredientEntityUnit, string> = {
  cups: 'cup',
  tablespoons: 'tablespoon',
  teaspoons: 'teaspoon',
  ounces: 'ounce',
  pounds: 'pound',
  fluidOunces: 'fluid ounce',
  pints: 'pint',
  quarts: 'quart',
  gallons: 'gallon',
  grams: 'gram',
  kilograms: 'kilogram',
  milliliters: 'millilter',
  liters: 'liter',
  whole: 'whole',
};

const IMPERIAL_VOLUME_CONVERSIONS = {
  cups: 1,
  tbs: 16,
  tsp: 48,
  oz: 8,
  pints: 0.5,
  quarts: 0.25,
  gallons: 0.0625,
};

const METRIC_VOLUME_CONVERSIONS = {
  ml: 236.588,
  L: 0.236588,
};

// Merge for all-units support
const VOLUME_CONVERSIONS = {
  ...IMPERIAL_VOLUME_CONVERSIONS,
  ...METRIC_VOLUME_CONVERSIONS,
};

type ImperialVolumeUnit = keyof typeof IMPERIAL_VOLUME_CONVERSIONS;
type MetricVolumeUnit = keyof typeof METRIC_VOLUME_CONVERSIONS;
export type VolumeUnit = ImperialVolumeUnit | MetricVolumeUnit;

export function convertVolume(
  amount: number,
  from: VolumeUnit,
  to: VolumeUnit,
): number {
  // Convert from source unit to cups (base unit)
  const inCups = amount / VOLUME_CONVERSIONS[from];
  // Convert from cups to target unit
  return inCups * VOLUME_CONVERSIONS[to];
}

export function getVolumeConversions(amount: number, from: VolumeUnit) {
  const imperial = {} as Record<ImperialVolumeUnit, number>;
  const metric = {} as Record<MetricVolumeUnit, number>;

  (Object.keys(IMPERIAL_VOLUME_CONVERSIONS) as ImperialVolumeUnit[]).forEach(
    (unit) => {
      imperial[unit] = convertVolume(amount, from, unit);
    },
  );
  (Object.keys(METRIC_VOLUME_CONVERSIONS) as MetricVolumeUnit[]).forEach(
    (unit) => {
      metric[unit] = convertVolume(amount, from, unit);
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- Remove the original unit from the conversions
  delete imperial[from as ImperialVolumeUnit];
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- Remove the original unit from the conversions
  delete metric[from as MetricVolumeUnit];
  return {
    imperial,
    metric,
  };
}

export function numberToFraction(value: number, maxDenominator = 10): string {
  if (!Number.isFinite(value)) {
    return value.toString();
  }

  if (value === Math.floor(value)) {
    return value.toString();
  }

  const sign = value < 0 ? -1 : 1;
  const positiveValue = Math.abs(value);

  let bestNumerator = 1;
  let bestDenominator = 1;
  let bestError = Math.abs(positiveValue - bestNumerator / bestDenominator);

  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    const numerator = Math.round(positiveValue * denominator);
    const error = Math.abs(positiveValue - numerator / denominator);
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
  const denominator = bestDenominator / commonDivisor;

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
