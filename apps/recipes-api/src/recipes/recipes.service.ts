import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { CreateRecipeDto } from './contracts/recipes/recipes.dto';
import { PrismaService } from 'src/prisma.service';

export type RecipeMinimalType = Prisma.RecipeGetPayload<{
  include: {
    tags: {
      select: { name: true };
    };
  };
}>;

export type RecipeType = Prisma.RecipeGetPayload<{
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

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecipes(): Promise<RecipeMinimalType[]> {
    return this.prisma.recipe.findMany({
      include: {
        tags: { select: { name: true } },
      },
    });
  }

  async getRecipe(slug: string): Promise<RecipeType> {
    return this.prisma.recipe.findFirstOrThrow({
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
  }

  async createRecipe(data: CreateRecipeDto): Promise<RecipeType> {
    return await this.prisma.recipe.create({
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
  }
}
