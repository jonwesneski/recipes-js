import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaService } from 'src/common';
import { S3Service } from 'src/common/s3.service';
import { CreateRecipeDto, EditRecipeDto } from './contracts';

type RecipeMinimalPrismaType = Prisma.RecipeGetPayload<{
  include: {
    user: { select: { handle: true } };
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
    user: { select: { handle: true } };
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
          omit: { stepId: true };
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

const RecipeInclude = {
  user: { select: { handle: true } },
  equipments: {
    omit: {
      id: true,
      createdAt: true,
      updatedAt: true,
      recipeId: true,
    },
  },
  steps: {
    include: {
      ingredients: {
        omit: { stepId: true },
      },
    },
    omit: { recipeId: true },
  },
  nutritionalFacts: {
    omit: {
      id: true,
      createdAt: true,
      updatedAt: true,
      recipeId: true,
    },
  },
  recipeTags: {
    include: { tag: { select: { name: true } } },
  },
} as const;

type RecipeUserType = { id: string; handle: string };
export type RecipeType = Omit<RecipePrismaType, 'recipeTags' | 'userId'> & {
  tags: string[];
  user: RecipeUserType;
};
export type RecipeMinimalType = Omit<
  RecipeMinimalPrismaType,
  'recipeTags' | 'userId'
> & {
  tags: string[];
  user: RecipeUserType;
};

@Injectable()
export class RecipesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  transformRecipe<T extends RecipePrismaType | RecipeMinimalPrismaType>(
    recipe: T,
  ): Omit<T, 'user' | 'recipeTags' | 'userId'> & {
    tags: string[];
    user: RecipeUserType;
  } {
    const { user, userId, recipeTags, ...rest } = recipe;
    return {
      ...rest,
      user: {
        id: userId,
        handle: user.handle,
      },
      tags: recipeTags.map((rt) => rt.tag.name),
    };
  }

  async getRecipes(): Promise<RecipeMinimalType[]> {
    const recipes = await this.prisma.recipe.findMany({
      include: {
        user: { select: { handle: true } },
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

  async getRecipe(userId: string, id: string): Promise<RecipeType> {
    const recipe = await this.prisma.recipe.findFirstOrThrow({
      where: {
        id,
        user: { id: userId },
      },
      include: RecipeInclude,
    });
    return this.transformRecipe(recipe);
  }

  async createRecipe(
    userId: string,
    data: CreateRecipeDto,
  ): Promise<RecipeType> {
    const { base64Image, tags, ...remainingData } = data;
    const s3BucketKeyName = data.name.replaceAll(' ', '_');
    const imageUrl = `${this.s3Service.cloudFrontBaseUrl}/${s3BucketKeyName}`;

    const recipe = await this.prisma.$transaction(async () => {
      const recipe = await this.prisma.recipe.create({
        data: {
          ...remainingData,
          userId,
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
        include: RecipeInclude,
      });

      await this.s3Service.uploadFile(
        s3BucketKeyName,
        Buffer.from(base64Image, 'base64'),
      );
      return recipe;
    });

    return this.transformRecipe(recipe);
  }

  async updateRecipe(
    userId: string,
    id: string,
    data: EditRecipeDto,
  ): Promise<RecipeType> {
    const { base64Image, tags, ...remainingData } = data;
    const s3BucketKeyName = `${userId}/${id}`;
    const imageUrl = base64Image
      ? `${this.s3Service.cloudFrontBaseUrl}/${s3BucketKeyName}`
      : undefined;

    const recipe = await this.prisma.$transaction(async () => {
      const recipe = await this.prisma.recipe.update({
        where: {
          id,
          user: { id: userId },
        },
        data: {
          ...remainingData,
          imageUrl,
          steps: {},
          equipments: {},
          nutritionalFacts: {},
        },
        include: RecipeInclude,
      });

      if (base64Image) {
        await this.s3Service.uploadFile(
          s3BucketKeyName,
          Buffer.from(base64Image, 'base64'),
        );
      }

      return recipe;
    });

    return this.transformRecipe(recipe);
  }
}
