import { z } from 'zod/v4';

export const AsianCuisineSchema = z.enum([
  'thai',
  'indian',
  'chinese',
  'japanese',
  'korean',
  'vietnamese',
  'filipino',
  'indonesian',
  'malaysian',
  'singaporean',
  'taiwanese',
  'burmese',
  'mongolian',
]);

export const EuropeanCuisineSchema = z.enum([
  'spanish',
  'french',
  'italian',
  'british',
  'german',
  'irish',
  'polish',
  'russian',
  'portuguese',
  'turkish',
  'scandinavian',
  'dutch',
  'belgian',
  'austrian',
  'swiss',
  'hungarian',
  'czech',
]);

export const MediterraneanCuisineSchema = z.enum([
  'middleEastern',
  'greek',
  'lebanese',
  'moroccan',
  'egyptian',
  'tunisian',
  'israeli',
]);

export const AmericansCuisineSchema = z.enum([
  'mexican',
  'american',
  'caribbean',
  'brazilian',
  'peruvian',
  'argentinian',
  'colombian',
  'cuban',
  'jamaican',
]);

export const AfricanCuisineSchema = z.enum([
  'ethiopian',
  'nigerian',
  'southAfrican',
  'kenyan',
  'ghanaian',
]);

export const FusionModernCuisineSchema = z.enum([
  'fusion',
  'contemporary',
  'cajunCreole',
  'texMex',
]);

export const RegionalSpecialtyCuisineSchema = z.enum([
  'mediterranean',
  'latinAmerican',
  'southeastAsian',
  'eastAsian',
  'northAfrican',
  'westAfrican',
  'centralAmerican',
  'southAmerican',
  'pacificIslander',
]);

export const CuisineTypeSchema = z.union([
  AsianCuisineSchema,
  EuropeanCuisineSchema,
  MediterraneanCuisineSchema,
  AmericansCuisineSchema,
  AfricanCuisineSchema,
  FusionModernCuisineSchema,
  RegionalSpecialtyCuisineSchema,
]);

export type CuisineType = z.infer<typeof CuisineTypeSchema>;

export const MealTypeSchema = z.enum([
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'dessert',
]);

export type MealType = z.infer<typeof MealTypeSchema>;

export const LiquidBasedDishSchema = z.enum([
  'soup',
  'stew',
  'chili',
  'broth',
  'bisque',
]);

export const SaladsRawDishSchema = z.enum(['salad', 'slaw']);

export const MainDishSchema = z.enum([
  'casserole',
  'stirFry',
  'roast',
  'grill',
  'pasta',
  'pizza',
  'sandwich',
  'burger',
  'tacos',
  'curry',
  'rice',
  'noodles',
]);

export const SidesDishSchema = z.enum(['side', 'appetizer', 'dimSum', 'mezes']);

export const BakedGoodsDishSchema = z.enum([
  'bread',
  'pastry',
  'pie',
  'cake',
  'cookies',
]);

export const BeveragesDishSchema = z.enum(['beverage', 'smoothie', 'cocktail']);

export const OtherDishSchema = z.enum([
  'sauce',
  'condiment',
  'dip',
  'chutney',
  'salsa',
]);

export const DishTypeSchema = z.union([
  LiquidBasedDishSchema,
  SaladsRawDishSchema,
  MainDishSchema,
  SidesDishSchema,
  BakedGoodsDishSchema,
  BeveragesDishSchema,
  OtherDishSchema,
]);

export type DishType = z.infer<typeof DishTypeSchema>;

export const DietaryTypeSchema = z.enum([
  'vegetarian',
  'vegan',
  'glutenFree',
  'dairyFree',
  'nutFree',
  'lowCarb',
]);

export type DietaryType = z.infer<typeof DietaryTypeSchema>;

export const PoultryProteinSchema = z.enum([
  'chicken',
  'turkey',
  'duck',
  'quail',
]);

export const RedMeatProteinSchema = z.enum([
  'beef',
  'pork',
  'lamb',
  'veal',
  'venison',
  'bison',
  'goat',
]);

export const FishProteinSchema = z.enum([
  'salmon',
  'tuna',
  'cod',
  'halibut',
  'tilapia',
  'trout',
  'mahi',
  'swordfish',
  'seaBass',
  'snapper',
]);

export const ShellfishProteinSchema = z.enum([
  'shrimp',
  'crab',
  'lobster',
  'scallops',
  'clams',
  'mussels',
  'oysters',
  'squid',
  'octopus',
]);

export const PlantBasedProteinSchema = z.enum([
  'tofu',
  'tempeh',
  'seitan',
  'legumes',
  'nuts',
  'seeds',
]);

export const EggsDairyProteinSchema = z.enum(['eggs', 'cheese', 'yogurt']);

export const ProcessedAlternativeProteinSchema = z.enum([
  'bacon',
  'sausage',
  'deli',
  'plantBasedMeat',
]);

export const ProteinTypeSchema = z.union([
  PoultryProteinSchema,
  RedMeatProteinSchema,
  FishProteinSchema,
  ShellfishProteinSchema,
  PlantBasedProteinSchema,
  EggsDairyProteinSchema,
  ProcessedAlternativeProteinSchema,
]);

export type ProteinType = z.infer<typeof ProteinTypeSchema>;

export const DifficultyLevelTypeSchema = z.enum(['easy', 'medium', 'hard']);

export type DifficultyLevelType = z.infer<typeof DifficultyLevelTypeSchema>;
