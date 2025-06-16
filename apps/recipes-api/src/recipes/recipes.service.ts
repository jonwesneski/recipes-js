import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaService } from 'src/prisma.service';
import { CreateRecipeDto } from './contracts/recipes/recipes.dto';

type RecipeMinimalPrismaType = Prisma.RecipeGetPayload<{
  include: {
    tags: {
      select: { name: true };
    };
  };
  omit: {
    id: true;
    createdAt: true;
    updatedAt: true;
    preparationTimeInMinutes: true;
    cookingTimeInMinutes: true;
  };
}>;

type RecipePrismaType = Prisma.RecipeGetPayload<{
  include: {
    equipments: {
      omit: { id: true; createdAt: true; updatedAt: true; recipeId: true };
    };
    steps: {
      include: {
        ingredients: {
          omit: { stepId: true; recipeId: true };
        };
      };
    };
    nutritionalFacts: {
      omit: { id: true; createdAt: true; updatedAt: true; recipeId: true };
    };
    tags: {
      select: { name: true };
    };
  };
}>;

export type RecipeType = Omit<RecipePrismaType, 'tags'> & { tags: string[] };
export type RecipeMinimalType = Omit<RecipeMinimalPrismaType, 'tags'> & {
  tags: string[];
};

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  transformRecipe<T extends RecipePrismaType | RecipeMinimalPrismaType>(
    recipe: T,
  ): Omit<T, 'tags'> & { tags: string[] } {
    return {
      ...recipe,
      tags: recipe.tags.map((tag) => tag.name),
    };
  }

  async getRecipes(): Promise<RecipeMinimalType[]> {
    const recipes = await this.prisma.recipe.findMany({
      include: {
        tags: { select: { name: true } },
      },
      omit: {
        id: true,
        createdAt: true,
        updatedAt: true,
        preparationTimeInMinutes: true,
        cookingTimeInMinutes: true,
      },
    });
    return recipes.map((recipe) => this.transformRecipe(recipe));
  }

  async getRecipe(slug: string): Promise<RecipeType> {
    const recipe = await this.prisma.recipe.findFirstOrThrow({
      where: {
        slug: slug,
      },
      include: {
        equipments: true,
        steps: {
          include: {
            ingredients: true,
          },
        },
        nutritionalFacts: true,
        tags: { select: { name: true } },
      },
    });
    return this.transformRecipe(recipe);
  }

  async createRecipe(data: CreateRecipeDto): Promise<RecipeType> {
    const recipe = await this.prisma.recipe.create({
      data: {
        ...data,
        steps: {
          create: data.steps.map((step) => ({
            instruction: step.instruction,
            ingredients: {
              createMany: {
                data:
                  step.ingredients?.map((ingredient) => ({
                    name: ingredient.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                  })) || [],
              },
            },
          })),
        },
        nutritionalFacts: {
          create: data.nutritionalFacts || {},
        },
        tags: {
          connectOrCreate: data.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        equipments: true,
        steps: {
          include: {
            ingredients: true,
          },
        },
        nutritionalFacts: true,
        tags: { select: { name: true } },
      },
    });
    return this.transformRecipe(recipe);
  }
}
