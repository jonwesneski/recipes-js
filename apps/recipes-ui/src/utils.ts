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
type VolumeUnit = ImperialVolumeUnit | MetricVolumeUnit;
type ConverionsType = {
  imperial: Record<ImperialVolumeUnit, number>;
  metric: Record<MetricVolumeUnit, number>;
};

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

// Example: get all conversions for a given amount in a given unit
export function getVolumeConversions(amount: number, from: VolumeUnit) {
  const conversions: ConverionsType = {
    imperial: {} as any,
    metric: {} as any,
  };
  (Object.keys(IMPERIAL_VOLUME_CONVERSIONS) as ImperialVolumeUnit[]).forEach(
    (unit) => {
      conversions.imperial[unit] = convertVolume(amount, from, unit);
    },
  );
  (Object.keys(METRIC_VOLUME_CONVERSIONS) as MetricVolumeUnit[]).forEach(
    (unit) => {
      conversions.metric[unit] = convertVolume(amount, from, unit);
    },
  );
  delete conversions.imperial[from as ImperialVolumeUnit]; // Remove the original unit from the conversions
  delete conversions.metric[from as MetricVolumeUnit];
  return conversions;
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
