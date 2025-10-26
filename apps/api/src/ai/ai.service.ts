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
  GeneratedClassifiersSchema,
  GeneratedClassifiersType,
  type GeneratedNutiritionalFactsType,
  GeneratedNutritionalFactsSchema,
} from '@repo/zod-schemas';
import { NutritionalFactsDto } from '@src/recipes';
import { GenerateBaseDto } from './contracts/generate-base.dto';
import { GenerateClassifiersDto } from './contracts/generate-classifiers.dto';
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

const tagsDeclaration /*: FunctionDeclaration*/ = {
  name: 'tags',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      cuisine: {
        type: 'string',
        enum: Object.values(CuisineType),
      },
      diets: {
        type: 'array',
        items: {
          type: 'string',
          enum: Object.values(DietaryType),
        },
      },
      dish: {
        type: 'string',
        enum: Object.values(DishType),
      },
      meal: {
        type: 'string',
        enum: Object.values(MealType),
      },
      proteins: {
        type: 'array',
        items: {
          type: 'string',
          enum: Object.values(ProteinType),
        },
      },
      difficultyLevel: {
        type: 'string',
        enum: Object.values(DifficultyLevelType),
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
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

  async classifiers(
    body: GenerateClassifiersDto,
  ): Promise<GeneratedClassifiersType> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: this.classifiersPrompt(body),
      config: {
        responseMimeType: 'application/json',
        responseSchema: tagsDeclaration.parametersJsonSchema,
      },
    });

    try {
      return GeneratedClassifiersSchema.parse(
        JSON.parse(response.text ?? '{}'),
      );
    } catch (error) {
      this.logger.error('JSON parsing or validation error:', error);
      throw error;
    }
  }

  classifiersPrompt(body: GenerateClassifiersDto) {
    return `Give me recipe tags for:
- recipe: ${body.name}
${body.description ? `- description: ${body.description}` : ``}

${this.basePrompt(body.steps)}

Tag Requirements:
- Make all the tags lowercase
- Total Tags: Aim for around 10 tags.
- Cuisine Tag: Include at least 1 tag representing the cuisine.
- Meal Tag: Include only 1 tag if it has a meal type (e.g., breakfast, lunch, dinner, dessert).
- Protein Tag: Include only 1 tag if it has a main protien (e.g., beef, chicken, tofu, lentils).
- Shareable Tag: Include only 1 tag if it has a shareable type (e.g., appetizer, snack, dim sum, mezes).
- Diet Tag: Include at least 1 tag that indicates dietary considerations (e.g., vegan, gluten-free).
- Seasonal Tag: Include only 1 tag if the recipe is seasonal (e.g., summer, winter).
- Festive/Holiday Tag: Include only 1 tag if the recipe is associated with a specific holiday or festival.
- Categories: Tags must belong into a category: Cuisine, Meal, Protein, Shareable, Diet, Seasonal, or Festive/Holiday
- Exclusions: Avoid using tags don't fit into the above requirements or that are overly general or redundant, such as "party," "sweet," "celebration," "dairy," and "baked."`;
  }
}
