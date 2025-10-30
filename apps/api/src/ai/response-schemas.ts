import {
  CuisineType,
  DietaryType,
  DifficultyLevelType,
  DishType,
  MealType,
  MeasurementUnit,
  ProteinType,
} from '@repo/database';
import {
  CuisineTypeSchema,
  DietaryTypeSchema,
  DifficultyLevelTypeSchema,
  DishTypeSchema,
  MealTypeSchema,
  ProteinTypeSchema,
} from '@repo/zod-schemas';
import { OperatorEnum } from '@src/common';
import { NutritionalFactsDto } from '@src/recipes';
import z from 'zod/v4';

export const MeasurementUnitValues = Object.values(MeasurementUnit);

export const nutritionalFactsDeclaration /*: FunctionDeclaration*/ = {
  name: 'nutritionalFacts',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      servings: {
        type: 'number',
      },
      servingAmount: {
        type: 'number',
      },
      servingUnit: {
        type: 'string',
        enum: Object.values(MeasurementUnit),
      },
      proteinInG: {
        type: 'number',
      },
      calciumInMg: {
        type: 'number',
      },
      caloriesInKcal: {
        type: 'number',
      },
      carbohydratesInG: {
        type: 'number',
      },
      cholesterolInMg: {
        type: 'number',
      },
      fiberInG: {
        type: 'number',
      },
      folateInMcg: {
        type: 'number',
      },
      ironInMg: {
        type: 'number',
      },
      magnesiumInMg: {
        type: 'number',
      },
      niacinInMg: {
        type: 'number',
      },
      potassiumInMg: {
        type: 'number',
      },
      riboflavinInMg: {
        type: 'number',
      },
      saturatedFatInG: {
        type: 'number',
      },
      sodiumInMg: {
        type: 'number',
      },
      sugarInG: {
        type: 'number',
      },
      thiaminInMg: {
        type: 'number',
      },
      totalFatInG: {
        type: 'number',
      },
      transFatInG: {
        type: 'number',
      },
      vitaminAInIU: {
        type: 'number',
      },
      vitaminB12InMg: {
        type: 'number',
      },
      vitaminB6InMg: {
        type: 'number',
      },
      vitaminCInMg: {
        type: 'number',
      },
      vitaminDInIU: {
        type: 'number',
      },
    } as Record<keyof NutritionalFactsDto, { type: string; enum?: string[] }>,
    required: ['caloriesInKcal'],
  },
};

export const CuisineTypeValues = Object.values(CuisineType);
export const DietaryTypeValues = Object.values(DietaryType);
export const DishTypeValues = Object.values(DishType);
export const MealTypeValues = Object.values(MealType);
export const ProteinTypeValues = Object.values(ProteinType);
export const DifficultyLevelTypeValues = Object.values(DifficultyLevelType);
export const OperatorTypeValues = ['AND', 'OR', 'NOT'];

export const categoriesDeclaration /*: FunctionDeclaration*/ = {
  name: 'categories',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      cuisine: {
        type: 'string',
        enum: [...CuisineTypeValues, null],
      },
      diets: {
        type: 'array',
        items: {
          type: 'string',
          enum: [...DietaryTypeValues, null],
        },
        default: [],
      },
      dish: {
        type: ['string', 'null'],
        enum: [...DishTypeValues, null],
      },
      meal: {
        type: ['string', 'null'],
        enum: [...MealTypeValues, null],
      },
      proteins: {
        type: 'array',
        items: {
          type: 'string',
          enum: [...ProteinTypeValues, null],
        },
        default: [],
      },
      difficultyLevel: {
        type: ['string', 'null'],
        enum: [...DifficultyLevelTypeValues, null],
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
        default: [],
      },
    },
    required: ['diets', 'proteins', 'tags'],
  },
};

export const recipesSearchDeclaration /*: FunctionDeclaration*/ = {
  name: 'recipesSearch',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      filters: {
        type: 'object',
        properties: {
          cuisines: {
            type: 'array',
            items: {
              type: 'string',
              enum: CuisineTypeValues,
            },
          },
          dishes: {
            type: 'array',
            items: {
              type: 'string',
              enum: DishTypeValues,
            },
          },
          meals: {
            type: 'array',
            items: {
              type: 'string',
              enum: MealTypeValues,
            },
          },
          diets: {
            type: 'object',
            properties: {
              operator: { type: 'string', enum: OperatorTypeValues },
              values: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: DietaryTypeValues,
                },
              },
            },
          },
          proteins: {
            type: 'object',
            properties: {
              operator: { type: 'string', enum: OperatorTypeValues },
              values: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ProteinTypeValues,
                },
              },
            },
          },
          difficultyLevels: {
            type: 'array',
            items: {
              type: 'string',
              enum: DifficultyLevelTypeValues,
            },
          },
        },
      },
    },
  },
};

export const GeneratedReceipesSearchResponseSchema = z.object({
  filters: z
    .object({
      meals: z.array(MealTypeSchema).optional(),
      dishes: z.array(DishTypeSchema).optional(),
      cuisines: z.array(CuisineTypeSchema).optional(),
      difficultyLevels: z.array(DifficultyLevelTypeSchema).optional(),
      diets: z
        .object({
          operator: z.enum(OperatorEnum),
          values: z.array(DietaryTypeSchema),
        })
        .optional(),
      proteins: z
        .object({
          operator: z.enum(OperatorEnum),
          values: z.array(ProteinTypeSchema),
        })
        .optional(),
    })
    .optional(),
});

export type GeneratedReceipesSearchResponseType = z.infer<
  typeof GeneratedReceipesSearchResponseSchema
>;
