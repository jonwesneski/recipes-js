import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaService } from 'src/common';
import { S3Service } from 'src/common/s3.service';
import { CreateRecipeDto } from './contracts';

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
      omit: {
        id: true;
        createdAt: true;
        updatedAt: true;
        recipeId: true;
        recipeSlug: true;
        recipeUserHandle: true;
      };
    };
    steps: {
      include: {
        ingredients: {
          omit: { stepId: true; recipeId: true };
        };
      };
      omit: { recipeSlug: true; recipeUserHandle: true };
    };
    nutritionalFacts: {
      omit: {
        id: true;
        createdAt: true;
        updatedAt: true;
        recipeId: true;
        recipeSlug: true;
        recipeUserHandle: true;
      };
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

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

  async getRecipe(userHandle: string, slug: string): Promise<RecipeType> {
    const recipe = await this.prisma.recipe.findFirstOrThrow({
      where: {
        slug,
        userHandle,
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
    this.s3Service.uploadFile(
      'example',
      Buffer.from(data.base64Image, 'base64'),
    );
    return await Promise.resolve({} as RecipeType);
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
        equipments: {
          connectOrCreate: data.equipments.map((equipment) => ({
            where: { name: equipment },
            create: { name: equipment },
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
