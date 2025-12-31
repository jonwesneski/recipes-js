import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClientKnownRequestError } from '@repo/database';
import {
  PrismaQueryParams,
  PrismaResults,
  PrismaService,
} from '../../services/prisma.service';
import { BookmarkOwnerError } from './exceptions';
import {
  PublicRecipesSearch,
  type RecipeCreateType,
  RecipeInclude,
  RecipeMinimalPrismaInclude,
  type RecipeMinimalPrismaType,
  type RecipeMinimalType,
  type RecipePrismaType,
  type RecipeType,
  type RecipeUpdateType,
} from './types';

export type GetRecipesQueryParams = PrismaQueryParams & {
  where: Prisma.RecipeWhereInput;
};

export type GetPublicRecipesQueryParams = PrismaQueryParams & {
  where: PublicRecipesSearch;
};

@Injectable()
export class RecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRecipes(
    params: GetRecipesQueryParams,
  ): Promise<PrismaResults<RecipeMinimalType[]>> {
    const recipes = await this.prisma.recipe.findMany({
      where: params.where,
      cursor: params.cursorId ? { id: params.cursorId } : undefined,
      skip: params.cursorId ? 1 : params.skip,
      take: params.take,
      ...RecipeMinimalPrismaInclude,
    });
    return {
      data: recipes.map((recipe) => this.transformRecipeMinimal(recipe)),
      pagination: {
        totalRecords: await this.prisma.recipe.count({
          where: { isPublic: true, userId: params.where.userId },
        }),
        currentCursor:
          recipes.length > 0 ? recipes[0].id : params.cursorId || null,
        nextCursor: recipes.length > 0 ? recipes[recipes.length - 1].id : null,
      },
    };
  }

  async getPublicRecipes(
    params: GetPublicRecipesQueryParams,
  ): Promise<PrismaResults<RecipeMinimalType[]>> {
    // const { diets, proteins, ...rest } = params;
    const recipes = await this.prisma.recipe.findMany({
      where: {
        ...params.where,
        isPublic: true,
      },
      cursor: params.cursorId ? { id: params.cursorId } : undefined,
      skip: params.cursorId ? 1 : params.skip,
      take: params.take,
      ...RecipeMinimalPrismaInclude,
      include: {
        ...RecipeMinimalPrismaInclude.include,
        _count: {
          select: {
            bookmarkedBy: {
              where: { userId: params.where.userId as string | undefined },
            },
          },
        },
      },
    });
    return {
      data: recipes.map((recipe) => this.transformRecipeMinimal(recipe)),
      pagination: {
        totalRecords: await this.prisma.recipe.count({
          where: { isPublic: true, userId: params.where.userId },
        }),
        currentCursor:
          recipes.length > 0 ? recipes[0].id : params.cursorId || null,
        nextCursor: recipes.length > 0 ? recipes[recipes.length - 1].id : null,
      },
    };
  }

  private transformRecipeMinimal(
    recipe: RecipeMinimalPrismaType,
    requestedUserId?: string,
  ): RecipeMinimalType {
    const { recipeTags, _count, ...rest } = recipe;
    let bookmarked: boolean | undefined = undefined;
    if (requestedUserId && requestedUserId !== recipe.user.id) {
      bookmarked = _count.bookmarkedBy > 0;
    }
    return {
      ...rest,
      tags: recipeTags.map((rt) => rt.tag.name),
      bookmarked,
    };
  }

  async getPublicRecipe(
    id: string,
    requestedUserId?: string,
  ): Promise<RecipeType> {
    const recipe = await this.prisma.recipe.findFirstOrThrow({
      where: {
        id,
        isPublic: true,
      },
      include: {
        ...RecipeInclude.include,
        user: {
          select: {
            ...RecipeInclude.include.user.select,
            _count: {
              select: { followers: { where: { userId: requestedUserId } } },
            },
          },
        },
      },
      omit: {
        ...RecipeInclude.omit,
      },
    });

    const { user, ...restRecipe } = recipe;
    const { _count, ...restUser } = user;
    const transformedRecipe = this.transformRecipe({
      ...restRecipe,
      user: restUser,
    });
    let amIFollowing: boolean | undefined =
      requestedUserId && requestedUserId !== recipe.user.id
        ? _count.followers > 0
        : undefined;
    transformedRecipe.user.amIFollowing = amIFollowing;
    return transformedRecipe;
  }

  async getRecipe(id: string, userId: string): Promise<RecipeType> {
    const recipe = await this.prisma.recipe.findFirstOrThrow({
      where: {
        id,
        userId,
      },
      ...RecipeInclude,
    });
    return this.transformRecipe(recipe);
  }

  private transformRecipe(
    recipe: RecipePrismaType,
    requestedUserId?: string,
  ): RecipeType {
    const { recipeTags, equipments, isPublic, _count, ...rest } = recipe;
    let bookmarked: boolean | undefined = undefined;
    if (requestedUserId && requestedUserId !== recipe.user.id) {
      bookmarked = _count.bookmarkedBy > 0;
    }

    let isRecipePublic: boolean | undefined = undefined;
    if (requestedUserId && requestedUserId === recipe.user.id) {
      isRecipePublic = isPublic;
    }

    return {
      ...rest,
      isPublic: isRecipePublic,
      equipments: equipments.map((e) => e.name),
      tags: recipeTags.map((rt) => rt.tag.name),
      bookmarked,
    };
  }

  async createRecipe(
    userId: string,
    data: RecipeCreateType,
  ): Promise<RecipeType> {
    const { tags, ...remainingData } = data;

    const recipe = await this.prisma.recipe.create({
      data: {
        ...remainingData,
        userId,
        imageUrl: undefined,
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
            imageUrl: undefined,
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
      ...RecipeInclude,
    });

    return this.transformRecipe(recipe);
  }

  async updateRecipe(
    userId: string,
    id: string,
    data: RecipeUpdateType,
  ): Promise<RecipeType> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- todo will handle later
    const { tags, ...remainingData } = data;

    const recipe = await this.prisma.recipe.update({
      where: {
        id,
        user: { id: userId },
      },
      data: {
        ...remainingData,
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
      ...RecipeInclude,
    });

    return this.transformRecipe(recipe);
  }

  async addImageToRecipe(id: string, imageUrl: string) {
    const recipe = await this.prisma.recipe.update({
      where: { id },
      data: { imageUrl },
      ...RecipeInclude,
    });

    return this.transformRecipe(recipe);
  }

  async addImageToRecipeStep(id: string, imageUrl: string) {
    await this.prisma.step.update({
      where: { id },
      data: { imageUrl },
    });
  }

  async bookmark(recipeId: string, userId: string, bookmark: boolean) {
    if (bookmark) {
      const recipe = await this.prisma.recipe.findUnique({
        where: { id: recipeId, userId },
      });
      if (recipe) {
        throw new BookmarkOwnerError();
      }

      await this.prisma.recipeBookmark.createMany({
        data: { userId, recipeId },
        skipDuplicates: true, // Ignoring if it already exists
      });
    } else {
      try {
        await this.prisma.recipeBookmark.delete({
          where: {
            userId_recipeId: { userId, recipeId },
          },
        });
      } catch (error) {
        if (
          !(error instanceof PrismaClientKnownRequestError) ||
          error.code !== 'P2025'
        ) {
          throw error;
        }
        // Ignoring if it doesn't exist
      }
    }
  }
}
