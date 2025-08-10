import { Injectable } from '@nestjs/common';
import { createId as cuid } from '@paralleldrive/cuid2';
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
    createdAt: true;
    updatedAt: true;
    preparationTimeInMinutes: true;
    cookingTimeInMinutes: true;
    isPublic: true;
  };
}>;

export type RecipePrismaType = Prisma.RecipeGetPayload<{
  include: {
    user: { select: { handle: true; id: true } };
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
          omit: { stepId: true; displayOrder: true };
        };
      };
      omit: { recipeId: true; displayOrder: true };
    };
    nutritionalFacts: {
      omit: {
        id: true;
        createdAt: true;
        updatedAt: true;
        recipeId: true;
        userId: true;
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

export const RecipeInclude = {
  user: { select: { handle: true, id: true } },
  equipments: {
    omit: {
      id: true,
      createdAt: true,
      updatedAt: true,
      recipeId: true,
    },
  },
  steps: {
    orderBy: { displayOrder: 'asc' },
    include: {
      ingredients: {
        omit: { stepId: true, displayOrder: true },
      },
    },
    omit: { recipeId: true, displayOrder: true },
  },
  nutritionalFacts: {
    omit: {
      id: true,
      createdAt: true,
      updatedAt: true,
      recipeId: true,
      userId: true,
    },
  },
  recipeTags: {
    include: { tag: { select: { name: true } } },
  },
} as const;

type RecipeUserType = { id: string; handle: string };
export type RecipeType = Omit<
  RecipePrismaType,
  'recipeTags' | 'userId' | 'equipments'
> & {
  tags: string[];
  equipments: string[];
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
    equipments?: string[];
    user: RecipeUserType;
  } {
    const { user, userId, recipeTags, ...rest } = recipe;

    let equipments: string[] | undefined = undefined;
    if ((recipe as RecipePrismaType).equipments) {
      equipments = (recipe as RecipePrismaType).equipments.map((e) => e.name);
    }
    return {
      ...rest,
      user: {
        id: userId,
        handle: user.handle,
      },
      equipments,
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
    const newId = cuid();
    const { s3BucketKeyName, s3ImageUrl } = this.s3Service.makeS3ImageUrl(
      userId,
      newId,
    );
    const stepsS3Images =
      remainingData.steps.reduce(
        (acc, s, i) => {
          if (s.base64Image) {
            const { s3BucketKeyName, s3ImageUrl } =
              this.s3Service.makeS3ImageUrl(userId, newId, i);
            acc[i] = {
              base64Image: s.base64Image,
              s3BucketKeyName,
              s3ImageUrl,
            };
          } else {
            acc[i] = {};
          }

          return acc;
        },
        {} as Record<
          number,
          {
            base64Image?: string;
            s3BucketKeyName?: string;
            s3ImageUrl?: string;
          }
        >,
      ) || {};

    const recipe = await this.prisma.$transaction(async () => {
      const recipe = await this.prisma.recipe.create({
        data: {
          ...remainingData,
          id: newId,
          userId,
          imageUrl: s3ImageUrl,
          steps: {
            create: data.steps.map((step, i) => ({
              displayOrder: i,
              instruction: step.instruction,
              ingredients: {
                createMany: {
                  data:
                    step.ingredients.map((ingredient, k) => {
                      return {
                        displayOrder: k,
                        amount: ingredient.amount,
                        unit: ingredient.unit,
                        name: ingredient.name,
                      };
                    }) || [],
                },
              },
              imageUrl: stepsS3Images[i].s3ImageUrl,
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

      await Promise.all([
        base64Image
          ? this.s3Service.uploadFile(
              s3BucketKeyName,
              Buffer.from(base64Image, 'base64'),
            )
          : undefined,
        ...Object.keys(stepsS3Images)
          .filter((key) => stepsS3Images[key].base64Image)
          .map((key) =>
            this.s3Service.uploadFile(
              stepsS3Images[key].s3BucketKeyName,
              Buffer.from(stepsS3Images[key].base64Image, 'base64'),
            ),
          ),
      ]);

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
          steps: {
            deleteMany: {
              id: {
                notIn: remainingData.steps
                  ?.map((s) => s.id)
                  .filter((id) => id !== undefined),
              },
            },
            upsert: remainingData.steps
              ?.filter((s) => s.id)
              .map((s, i) => {
                return {
                  where: { id: s.id },
                  update: {
                    displayOrder: i,
                    ...s,
                    ingredients: {
                      deleteMany: {
                        id: {
                          notIn: s.ingredients
                            ? s.ingredients
                                .map((ing) => ing.id)
                                .filter((id) => id !== undefined)
                            : [],
                        },
                      },
                      upsert: s.ingredients
                        ? s.ingredients
                            .filter((ing) => ing.id)
                            .map((ing, k) => {
                              return {
                                where: { id: ing.id },
                                update: { ...ing, displayOrder: k },
                                create: { ...ing, displayOrder: k },
                              };
                            })
                        : [],
                    },
                  },
                  create: {
                    displayOrder: i,
                    ...s,
                    ingredients: {
                      createMany: {
                        data: s.ingredients
                          ? s.ingredients
                              .filter((ing) => !ing.id)
                              .map((ing, k) => ({
                                displayOrder: k,
                                ...ing,
                              }))
                          : [],
                      },
                    },
                  },
                };
              }),
            create: remainingData.steps
              ?.filter((s) => !s.id)
              .map((step, i) => ({
                displayOrder: i,
                instruction: step.instruction,
                ingredients: {
                  createMany: {
                    data: step.ingredients
                      ? step.ingredients.map((ingredient, k) => {
                          return {
                            displayOrder: k,
                            amount: ingredient.amount,
                            unit: ingredient.unit,
                            name: ingredient.name,
                          };
                        })
                      : [],
                  },
                },
              })),
          },
          // TODO: handle below
          equipments: {
            ...(remainingData.equipments
              ? {
                  deleteMany: {
                    name: {
                      notIn: remainingData.equipments,
                    },
                  },
                }
              : {}),
          },
          nutritionalFacts: {},
          //recipeTags: {},
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
