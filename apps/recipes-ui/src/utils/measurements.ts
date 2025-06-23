import { IngredientEntityUnit } from '@repo/recipes-codegen/model';
import { z } from 'zod/v4';

export const measurementUnits = Object.keys(IngredientEntityUnit);
export const measurementUnitsAbbreviated: Record<IngredientEntityUnit, string> =
  {
    whole: 'whole',
    pinches: 'pinch',
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
  };
export const measurementUnitsSingular: Record<IngredientEntityUnit, string> = {
  whole: 'whole',
  pinches: 'pinch',
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
};

const IMPERIAL_VOLUME_CONVERSIONS: Record<
  Extract<
    IngredientEntityUnit,
    | 'cups'
    | 'tablespoons'
    | 'teaspoons'
    | 'fluidOunces'
    | 'pints'
    | 'quarts'
    | 'gallons'
  >,
  number
> = {
  cups: 1,
  tablespoons: 16,
  teaspoons: 48,
  fluidOunces: 8,
  pints: 0.5,
  quarts: 0.25,
  gallons: 0.0625,
};

const METRIC_VOLUME_CONVERSIONS: Record<
  Extract<IngredientEntityUnit, 'milliliters' | 'liters'>,
  number
> = {
  milliliters: 236.588,
  liters: 0.236588,
};

const IMPERIAL_WEIGHT_CONVERSIONS: Record<
  Extract<IngredientEntityUnit, 'pounds' | 'ounces'>,
  number
> = {
  pounds: 1,
  ounces: 16,
};

const METRIC_WEIGHT_CONVERSIONS: Record<
  Extract<IngredientEntityUnit, 'grams' | 'kilograms'>,
  number
> = {
  grams: 1,
  kilograms: 100,
};

const VOLUME_CONVERSIONS = {
  ...IMPERIAL_VOLUME_CONVERSIONS,
  ...METRIC_VOLUME_CONVERSIONS,
};

const WEIGHT_CONVERSIONS = {
  ...IMPERIAL_WEIGHT_CONVERSIONS,
  ...METRIC_WEIGHT_CONVERSIONS,
};

type ImperialVolumeUnit = keyof typeof IMPERIAL_VOLUME_CONVERSIONS;
type MetricVolumeUnit = keyof typeof METRIC_VOLUME_CONVERSIONS;
export type VolumeUnit = ImperialVolumeUnit | MetricVolumeUnit;

type ImperialWeightUnit = keyof typeof IMPERIAL_WEIGHT_CONVERSIONS;
type MetricWeightUnit = keyof typeof METRIC_WEIGHT_CONVERSIONS;
export type WeightUnit = ImperialWeightUnit | MetricWeightUnit;
const weightUnitSchema = z.union(
  Object.keys(WEIGHT_CONVERSIONS).map((l) => z.literal(l)),
);

export const isWeight = (unit: string) => {
  return weightUnitSchema.safeParse(unit).success;
};

export const getConversions = (
  amount: number,
  from: VolumeUnit | WeightUnit,
) => {
  if (isWeight(from)) {
    return {
      type: 'Weight',
      values: getWeightConversions(amount, from as WeightUnit),
    };
  }

  return {
    type: 'Volume',
    values: getVolumeConversions(amount, from as VolumeUnit),
  };
};

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

function convertVolume(
  amount: number,
  from: VolumeUnit,
  to: VolumeUnit,
): number {
  // Convert from source unit to cups (base unit)
  const baseUnit = amount / VOLUME_CONVERSIONS[from];
  // Convert from cups to target unit
  return baseUnit * VOLUME_CONVERSIONS[to];
}

export function getWeightConversions(amount: number, from: WeightUnit) {
  const imperial = {} as Record<ImperialWeightUnit, number>;
  const metric = {} as Record<MetricWeightUnit, number>;

  (Object.keys(IMPERIAL_WEIGHT_CONVERSIONS) as ImperialWeightUnit[]).forEach(
    (unit) => {
      imperial[unit] = convertWeight(amount, from, unit);
    },
  );
  (Object.keys(METRIC_WEIGHT_CONVERSIONS) as MetricWeightUnit[]).forEach(
    (unit) => {
      metric[unit] = convertWeight(amount, from, unit);
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- Remove the original unit from the conversions
  delete imperial[from as ImperialWeightUnit];
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- Remove the original unit from the conversions
  delete metric[from as MetricWeightUnit];
  return {
    imperial,
    metric,
  };
}

export function convertWeight(
  amount: number,
  from: WeightUnit,
  to: WeightUnit,
): number {
  // Convert from source unit to (base unit)
  const baseUnit = amount / WEIGHT_CONVERSIONS[from];
  // Convert from unit to target unit
  return baseUnit * WEIGHT_CONVERSIONS[to];
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
