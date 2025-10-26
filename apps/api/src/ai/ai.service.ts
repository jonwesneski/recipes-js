import { Injectable, Logger } from '@nestjs/common';
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
  GeneratedCategoriesSchema,
  GeneratedCategoriesType,
  type GeneratedNutiritionalFactsType,
  GeneratedNutritionalFactsSchema,
} from '@repo/zod-schemas';
import { NutritionalFactsDto } from '@src/recipes';
import { GenerateBaseDto } from './contracts/generate-base.dto';
import { GenerateCategoriesDto } from './contracts/generate-categories.dto';
import { GenerateNutritionalFactsDto } from './contracts/generate-nutritional-facts.dto';

// '@google/genai' is an ESM. I tried changing my project to ESM
// I got the src to build and run, but I couldn't get jest to compile
// in ESM. So for now I am doing it this way.
const createGoogleGenAI = async (apiKey: string) => {
  const { GoogleGenAI } = await import('@google/genai');
  return new GoogleGenAI({ apiKey });
};
type GoogleGenAIType = Awaited<ReturnType<typeof createGoogleGenAI>>;

const nutritionalFactsDeclaration /*: FunctionDeclaration*/ = {
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

const categoriesDeclaration /*: FunctionDeclaration*/ = {
  name: 'categories',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      cuisine: {
        type: ['string', 'null'],
        enum: [...Object.values(CuisineType), null],
      },
      diets: {
        type: 'array',
        items: {
          type: 'string',
          enum: [...Object.values(DietaryType), null],
        },
        default: [],
      },
      dish: {
        type: ['string', 'null'],
        enum: [...Object.values(DishType), null],
      },
      meal: {
        type: ['string', 'null'],
        enum: [...Object.values(MealType), null],
      },
      proteins: {
        type: 'array',
        items: {
          type: 'string',
          enum: [...Object.values(ProteinType), null],
        },
        default: [],
      },
      difficultyLevel: {
        type: ['string', 'null'],
        enum: [...Object.values(DifficultyLevelType), null],
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

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ai: GoogleGenAIType;

  constructor(googleAi: GoogleGenAIType) {
    this.ai = googleAi;
  }

  static async createInstance(apiKey: string) {
    return new AiService(await createGoogleGenAI(apiKey));
  }

  basePrompt(steps: GenerateBaseDto[]) {
    const promptArray: string[] = [];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepCount = i + 1;
      const ingredients: string[] = [];
      for (const ingredient of step.ingredients) {
        ingredients.push(
          `- ${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit} ` : ' '}${ingredient.name}`,
        );
      }
      promptArray.push(`Step ${stepCount} Ingredients:
${ingredients.length ? ingredients.join('\n') : '- None'}

Step ${stepCount} Instructions:
${step.instruction ? step.instruction : '- None'}
`);
    }
    return promptArray.join('\n');
  }

  async nutritionalFacts(
    steps: GenerateNutritionalFactsDto[],
  ): Promise<GeneratedNutiritionalFactsType> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: this.nutritionalPrompt(steps),
      config: {
        responseMimeType: 'application/json',
        responseSchema: nutritionalFactsDeclaration.parametersJsonSchema,
      },
    });

    try {
      return GeneratedNutritionalFactsSchema.parse(
        JSON.parse(response.text ?? '{}'),
      );
    } catch (error) {
      this.logger.error('JSON parsing or validation error:', error);
      throw error;
    }
  }

  nutritionalPrompt(steps: GenerateNutritionalFactsDto[]) {
    return `Give me nutritional facts for:\n${this.basePrompt(steps)}`;
  }

  async categories(
    body: GenerateCategoriesDto,
  ): Promise<GeneratedCategoriesType> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: this.categoriesPrompt(body),
      config: {
        responseMimeType: 'application/json',
        responseSchema: categoriesDeclaration.parametersJsonSchema,
      },
    });

    try {
      return GeneratedCategoriesSchema.parse(
        JSON.parse(response.text ?? 'null'),
      );
    } catch (error) {
      this.logger.error('JSON parsing or validation error:', error);
      throw error;
    }
  }

  categoriesPrompt(body: GenerateCategoriesDto) {
    return `Give me recipe categories for:
- recipe: ${body.name}
${body.description ? `- description: ${body.description}` : ''}

${this.basePrompt(body.steps)}

//todo: update this
Category Requirements:
- Only add a cuisine if the recipe mostly fits in one of them
- Only add diet(s) if the recipe mostly fits in them
- Only add a dish if the recipe mostly fits in one of them
- Only add a meal if the recipe mostly fits in one of them
- Only add a protein(s) if the recipe mostly fits in them
- Only add a difficultyLevel if the recipe mostly fits in one of them
- I want preferably 0 tags, buy only add tags if: 
  - total tags is less than 5
  - value has not already used in one of the above categories: (cuisine, diet, dish, meal, protein, difficultyLevel)`;
  }
}
