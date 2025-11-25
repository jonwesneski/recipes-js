import { type NutritionalFactsDto } from '@repo/codegen/model';
import { camelCaseToSpaces } from './stringHelpers';

export const nutritionalFactsConst: NutritionalFactsDto = {
  proteinInG: null,
  totalFatInG: null,
  carbohydratesInG: null,
  fiberInG: null,
  sugarInG: null,
  sodiumInMg: null,
  cholesterolInMg: null,
  saturatedFatInG: null,
  transFatInG: null,
  potassiumInMg: null,
  vitaminAInIU: null,
  vitaminCInMg: null,
  calciumInMg: null,
  ironInMg: null,
  vitaminDInIU: null,
  vitaminB6InMg: null,
  vitaminB12InMg: null,
  magnesiumInMg: null,
  folateInMcg: null,
  thiaminInMg: null,
  riboflavinInMg: null,
  niacinInMg: null,
  caloriesInKcal: null,
} as const;

export const getNameAndUnit = (nutritionalFactName: string) => {
  const [name, unit] = nutritionalFactName.split('In');
  let normalizedName = camelCaseToSpaces(name);
  // Keep the casing for vitmain A, B, C etc.
  if (!normalizedName.includes('vitamin ')) {
    normalizedName = normalizedName.toLowerCase();
  }
  return [normalizedName, unit];
};
