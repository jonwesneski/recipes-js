import { NutritionalFactsDto } from '@repo/codegen/model';
import { camelCaseToSpaces } from './stringHelpers';

type _CompileTimeType = Omit<
  NutritionalFactsDto,
  'servings' | 'servingAmount' | 'servingUnit'
>;
export const nutritionalFactsConst: _CompileTimeType = {
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
  return [camelCaseToSpaces(name), unit];
};
