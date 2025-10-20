import {
  IngredientResponseUnit,
  MeasurementFormat,
  type NumberFormat,
} from '@repo/codegen/model';
import { z } from 'zod/v4';

export type AllMeasurements = NonNullable<IngredientResponseUnit>;
export const measurementUnits = Object.keys(IngredientResponseUnit);
export const measurementUnitsAbbreviated: Record<AllMeasurements, string> = {
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
export const measurementUnitsSingular: Record<AllMeasurements, string> = {
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
export const measurementUnitsPlural: Record<AllMeasurements, string> = {
  cups: 'cups',
  tablespoons: 'tablespoons',
  teaspoons: 'teaspoons',
  ounces: 'ounces',
  pounds: 'pounds',
  fluidOunces: 'fluid ounces',
  pints: 'pints',
  quarts: 'quarts',
  gallons: 'gallons',
  grams: 'grams',
  kilograms: 'kilograms',
  milliliters: 'millilters',
  liters: 'liters',
};

const IMPERIAL_VOLUME_CONVERSIONS: Record<
  Extract<
    IngredientResponseUnit,
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
  Extract<IngredientResponseUnit, 'milliliters' | 'liters'>,
  number
> = {
  milliliters: 236.588,
  liters: 0.236588,
};

const IMPERIAL_WEIGHT_CONVERSIONS: Record<
  Extract<IngredientResponseUnit, 'pounds' | 'ounces'>,
  number
> = {
  pounds: 1,
  ounces: 16,
};

const METRIC_WEIGHT_CONVERSIONS: Record<
  Extract<IngredientResponseUnit, 'grams' | 'kilograms'>,
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

const METRIC_MEASUREMENTS = {
  ...METRIC_VOLUME_CONVERSIONS,
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

const metricUnitSchema = z.union(
  Object.keys(METRIC_MEASUREMENTS).map((l) => z.literal(l)),
);

export const isMetric = (unit: string) => {
  return metricUnitSchema.safeParse(unit).success;
};

export const getConversions = (amount: number, from: AllMeasurements) => {
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

export const getVolumeConversions = (amount: number, from: VolumeUnit) => {
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
};

const convertVolume = (
  amount: number,
  from: VolumeUnit,
  to: VolumeUnit,
): number => {
  // Convert from source unit to cups (base unit)
  const baseUnit = amount / VOLUME_CONVERSIONS[from];
  // Convert from cups to target unit
  return baseUnit * VOLUME_CONVERSIONS[to];
};

export const getWeightConversions = (amount: number, from: WeightUnit) => {
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
};

export const convertWeight = (
  amount: number,
  from: WeightUnit,
  to: WeightUnit,
): number => {
  // Convert from source unit to (base unit)
  const baseUnit = amount / WEIGHT_CONVERSIONS[from];
  // Convert from unit to target unit
  return baseUnit * WEIGHT_CONVERSIONS[to];
};

export const numberToFraction = (
  value: number,
  maxDenominator = 10,
): string => {
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
};

export const fractionToNumber = (fractionString: string): number => {
  const parts = fractionString.split(' ');
  let whole = 0;
  let fractionIndex = 0;
  if (parts.length === 2) {
    whole = Number(parts[0]);
    fractionIndex = 1;
  }
  const fractionParts = parts[fractionIndex].split('/');
  if (fractionParts.length === 2 && !isNaN(whole)) {
    const numerator = Number(fractionParts[0]);
    const denominator = Number(fractionParts[1]);
    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return whole + numerator / denominator;
    }
  }
  return NaN;
};

export const determineAmountFormat = (
  amount: number,
  scaleFactor: number,
  isFraction: boolean,
  numberFormatPreference: NumberFormat,
) => {
  const roundedNumber = roundToDecimal(amount * scaleFactor, 2);
  return numberFormatPreference === 'fraction' ||
    (isFraction && numberFormatPreference === 'default')
    ? numberToFraction(roundedNumber)
    : roundedNumber.toString();
};

export const roundToDecimal = (num: number, decimalPlaces: number): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
};

export const determineAmountUnit = (
  amount: number,
  unit: IngredientResponseUnit,
  convertTo: MeasurementFormat,
) => {
  if (!unit) {
    return { amount, unit };
  }

  const _isMetric = isMetric(unit);
  if (convertTo === MeasurementFormat.imperial && _isMetric) {
    // Get the amount that is closest to 1 in imperial units
    const imperialConversions = getConversions(amount, unit).values.imperial;
    let closestUnit = 'cups' as keyof typeof imperialConversions;
    let closestAmount = Infinity;
    for (const [key, value] of Object.entries(imperialConversions)) {
      const absValue = Math.abs(value - 1);
      if (absValue < closestAmount) {
        closestAmount = absValue;
        closestUnit = key as keyof typeof imperialConversions;
      }
    }
    return {
      amount: imperialConversions[closestUnit],
      unit: closestUnit,
    };
  } else if (convertTo === MeasurementFormat.metric && !_isMetric) {
    // Get the amount that is closest to 1 in metric units
    const metricConversions = getConversions(amount, unit).values.metric;
    let closestUnit = 'grams' as keyof typeof metricConversions;
    let closestAmount = Infinity;
    for (const [key, value] of Object.entries(metricConversions)) {
      const absValue = Math.abs(value - 1);
      if (absValue < closestAmount) {
        closestAmount = absValue;
        closestUnit = key as keyof typeof metricConversions;
      }
    }
    return {
      amount: metricConversions[closestUnit],
      unit: closestUnit,
    };
  }
  return { amount, unit };
};
