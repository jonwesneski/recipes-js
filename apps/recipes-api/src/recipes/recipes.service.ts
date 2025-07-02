import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaService } from 'src/common';
import { S3Service } from 'src/common/s3.service';
import { CreateRecipeDto } from './contracts';

type RecipeMinimalPrismaType = Prisma.RecipeGetPayload<{
  include: {
    recipeTags: {
      include: {
        tag: {
          select: { name: true };
        };
      };
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
      };
    };
    steps: {
      include: {
        ingredients: {
          omit: { stepId: true; recipeId: true };
        };
      };
      omit: { recipeId: true };
    };
    nutritionalFacts: {
      omit: {
        id: true;
        createdAt: true;
        updatedAt: true;
        recipeId: true;
      };
    };
    recipeTags: {
      include: {
        tag: {
          select: { name: true };
        };
      };
    };
  };
}>;

export type RecipeType = Omit<RecipePrismaType, 'recipeTags'> & {
  tags: string[];
};
export type RecipeMinimalType = Omit<RecipeMinimalPrismaType, 'recipeTags'> & {
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
  ): Omit<T, 'recipeTags'> & { tags: string[] } {
    return {
      ...recipe,
      tags: recipe.recipeTags.map((rt) => rt.tag.name),
    };
  }

  async getRecipes(): Promise<RecipeMinimalType[]> {
    const recipes = await this.prisma.recipe.findMany({
      include: {
        recipeTags: {
          include: { tag: { select: { name: true } } },
        },
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

  async getRecipe(userHandle: string, id: string): Promise<RecipeType> {
    const recipe = await this.prisma.recipe.findFirstOrThrow({
      where: {
        id,
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
        recipeTags: {
          include: { tag: { select: { name: true } } },
        },
      },
    });
    return this.transformRecipe(recipe);
  }

  async createRecipe(data: CreateRecipeDto): Promise<RecipeType> {
    const { base64Image, tags, ...remainingData } = data;
    const s3BucketKeyName = data.name.replaceAll(' ', '_');
    const imageUrl = `${this.s3Service.cloudFrontBaseUrl}/${s3BucketKeyName}`;

    const recipe = await this.prisma.$transaction(async () => {
      const recipe = await this.prisma.recipe.create({
        data: {
          ...remainingData,
          imageUrl,
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
          recipeTags: {
            create: tags.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag },
                },
              },
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
          recipeTags: {
            include: { tag: { select: { name: true } } },
          },
        },
      });

      await this.s3Service.uploadFile(
        s3BucketKeyName,
        Buffer.from(base64Image, 'base64'),
      );
      return recipe;
    });

    return this.transformRecipe(recipe);
  }
}
