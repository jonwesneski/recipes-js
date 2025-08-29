import { Injectable, Logger } from '@nestjs/common';
import { MeasurementUnit } from '@repo/database';
import {
  type GeneratedNutiritionalFactsType,
  GeneratedNutritionalFactsSchema,
} from '@repo/zod-schemas';
import { NutritionalFactsDto } from '@src/recipes';
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

  nutritionalPrompt(steps: GenerateNutritionalFactsDto[]) {
    const promptArray: string[] = [];
    for (const step of steps) {
      const ingredients: string[] = [];
      for (const ingredient of step.ingredients) {
        ingredients.push(
          `- ${ingredient.amount} ${ingredient.unit} ${ingredient.name}`,
        );
      }
      promptArray.push(`${ingredients.join('\n')}

${step.instruction}      
        `);
    }
    return promptArray.join('\n');
  }

  async nutritionalFacts(
    steps: GenerateNutritionalFactsDto[],
  ): Promise<GeneratedNutiritionalFactsType> {
    // const models = await this.ai.models.list();
    // console.log(models, 'mmm');
    const response = await this.ai.models.generateContent({
      //model: 'gemini-1.5-pro',
      model: 'gemini-2.0-flash-lite',
      contents: `Give me nutritional facts for:\n${this.nutritionalPrompt(steps)}`,
      config: {
        // toolConfig: {
        //   functionCallingConfig: {
        //     mode: 'ANY' as never, //FunctionCallingConfigMode.ANY,
        //     allowedFunctionNames: ['nutritionalFacts'],
        //   },
        // },
        // tools: [{ functionDeclarations: [nutritionalFactsDeclaration] }],
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
}
