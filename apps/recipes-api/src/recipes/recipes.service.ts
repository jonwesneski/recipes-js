import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { CreateRecipeDto } from './dtos';
import { PrismaService } from 'src/prisma.service';

type Recipe = Prisma.RecipeGetPayload<{
  include: {
    steps: {
      include: {
        ingredients: true;
      };
    };
    nutritionalFacts: true;
    tags: true;
  };
}>;

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecipe(slug: string): Promise<Recipe> {
    return this.prisma.recipe.findFirstOrThrow({
      where: {
        slug: slug,
      },
      include: {
        steps: {
          include: {
            ingredients: true,
          },
        },
        nutritionalFacts: true,
        tags: true,
      },
    });
  }

  async createRecipe(data: CreateRecipeDto): Promise<Recipe> {
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
          create: data.nutritionalFacts,
        },
        tags: {
          connectOrCreate: data.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        steps: {
          include: {
            ingredients: true,
          },
        },
        nutritionalFacts: true,
        tags: true,
      },
    });
  }
}
