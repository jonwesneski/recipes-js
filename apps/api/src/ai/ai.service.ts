import { Injectable, Logger } from '@nestjs/common';
import { RecipeRepository } from '@repo/nest-shared';
import {
  GeneratedCategoriesSchema,
  GeneratedCategoriesType,
  GeneratedServingsAndNutritionalFactsSchema,
  type GeneratedServingsAndNutritionalFactsType,
} from '@repo/zod-schemas';
import { recipesDtoToQueryParams } from '@src/common/transforms';
import { GetRecipesDto } from '@src/recipes';
import { GenerateBaseDto } from './contracts/generate-base.dto';
import { GenerateCategoriesDto } from './contracts/generate-categories.dto';
import { GenerateNutritionalFactsDto } from './contracts/generate-nutritional-facts.dto';
import { GetRecipesSearchDto } from './contracts/get-recipes.dto';
import {
  categoriesDeclaration,
  CuisineTypeValues,
  DietaryTypeValues,
  DifficultyLevelTypeValues,
  DishTypeValues,
  GeneratedReceipesSearchResponseSchema,
  MealTypeValues,
  nutritionalFactsDeclaration,
  ProteinTypeValues,
  recipesSearchDeclaration,
} from './response-schemas';

// '@google/genai' is an ESM. I tried changing my project to ESM
// I got the src to build and run, but I couldn't get jest to compile
// in ESM. So for now I am doing it this way.
const createGoogleGenAI = async (apiKey: string) => {
  const { GoogleGenAI } = await import('@google/genai');
  return new GoogleGenAI({ apiKey });
};
type GoogleGenAIType = Awaited<ReturnType<typeof createGoogleGenAI>>;

const AI_MODEL = 'gemini-2.0-flash-lite';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ai: GoogleGenAIType;

  constructor(
    googleAi: GoogleGenAIType,
    private readonly recipeRepository: RecipeRepository,
  ) {
    this.ai = googleAi;
  }

  static async createInstance(
    apiKey: string,
    recipeRepository: RecipeRepository,
  ) {
    return new AiService(await createGoogleGenAI(apiKey), recipeRepository);
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
  ): Promise<GeneratedServingsAndNutritionalFactsType> {
    const response = await this.ai.models.generateContent({
      model: AI_MODEL,
      contents: this.nutritionalPrompt(steps),
      config: {
        responseMimeType: 'application/json',
        responseSchema: nutritionalFactsDeclaration.parametersJsonSchema,
      },
    });

    try {
      return GeneratedServingsAndNutritionalFactsSchema.parse(
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
      model: AI_MODEL,
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

  async recipesSearch(body: GetRecipesSearchDto) {
    const response = await this.ai.models.generateContent({
      model: AI_MODEL,
      contents: this.recipesSearchPrompt(body),
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipesSearchDeclaration.parametersJsonSchema,
      },
    });

    let params: GetRecipesDto = {};
    try {
      params = GeneratedReceipesSearchResponseSchema.parse(
        JSON.parse(response.text ?? 'null'),
      );
    } catch (error) {
      this.logger.error('JSON parsing or validation error:', error);
      throw error;
    }
    return await this.recipeRepository.getPublicRecipes(
      recipesDtoToQueryParams(params),
    );
  }

  recipesSearchPrompt(body: GetRecipesSearchDto) {
    return `You are a recipe search assistant. Convert the natural language query into structured filters.
    
Valid filter options:
- meals: ${MealTypeValues.join(', ')}
- dishes: ${DishTypeValues.join(', ')}
- cuisine: ${CuisineTypeValues.join(', ')}
- difficultyLevel: ${DifficultyLevelTypeValues.join(', ')}
- diets: ${DietaryTypeValues.join(', ')}
- proteins: ${ProteinTypeValues.join(', ')}

Operators:
- "AND" (must have ALL of option), "OR" (can have ANY of option), "NOT" (must NOT have these options)

User query: "${body.input}"

Return ONLY a JSON object with a "filters" key. Only include filters that are explicitly mentioned or strongly implied. Use camelCase for values like "glutenFree".

Examples:
- "vegetarian Italian dinner" -> {"filters": {"meals": ["dinner"], "cuisines": ["italian"], "diets": ["vegetarian"]}}
- "easy chicken or beef lunch" -> {"filters": {"meals": ["lunch"], "difficultyLevels": ["easy"], "proteins": {"operator": "OR", "values: ["chicken", "beef"]}}}
- "vegan and gluten free breakfast" -> {"filters": {"meals": ["breakfast"], "diets": {"operator": "AND", "values": ["vegan", "glutenFree"]}}}`;
  }
}
