import { Injectable } from '@nestjs/common';
import {
  PrismaQueryParams,
  PrismaResults,
  PrismaService,
} from '../services/prisma.service';
import {
  type RecipeCreateType,
  RecipeInclude,
  type RecipeMinimalPrismaType,
  type RecipeMinimalType,
  type RecipePrismaType,
  type RecipeType,
  type RecipeUpdateType,
  type RecipeUserType,
} from './types';

export type GetRecipesQueryParams = PrismaQueryParams & {
  userId?: string;
};

@Injectable()
export class RecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  transformRecipe<T extends RecipePrismaType | RecipeMinimalPrismaType>(
    recipe: T,
  ): Omit<T, 'recipeTags'> & {
    tags: string[];
    equipments?: string[];
    user: RecipeUserType;
  } {
    const { recipeTags, ...rest } = recipe;

    let equipments: string[] | undefined = undefined;
    if ((recipe as RecipePrismaType).equipments) {
      equipments = (recipe as RecipePrismaType).equipments.map((e) => e.name);
    }
    return {
      ...rest,
      equipments,
      tags: recipeTags.map((rt) => rt.tag.name),
    };
  }

  async getRecipes(
    params: GetRecipesQueryParams,
  ): Promise<PrismaResults<RecipeMinimalType[]>> {
    const recipes = await this.prisma.recipe.findMany({
      where: { isPublic: true, userId: params.userId },
      cursor: params.cursorId ? { id: params.cursorId } : undefined,
      skip: params.cursorId ? 1 : undefined,
      include: {
        user: { select: { handle: true, id: true, imageUrl: true } },
        recipeTags: {
          include: { tag: { select: { name: true } } },
        },
      },
      omit: {
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return {
      data: recipes.map((recipe) => this.transformRecipe(recipe)),
      pagination: {
        totalRecords: await this.prisma.recipe.count({
          where: { isPublic: true, userId: params.userId },
        }),
        currentCursor:
          recipes.length > 0 ? recipes[0].id : params.cursorId || null,
        nextCursor: recipes.length > 0 ? recipes[recipes.length - 1].id : null,
      },
    };
  }

  async getRecipe(id: string, userId?: string): Promise<RecipeType> {
    const recipe = await this.prisma.recipe.findFirstOrThrow({
      where: {
        id,
        userId,
      },
      ...RecipeInclude,
    });
    return this.transformRecipe(recipe);
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
    const { tags, ...remainingData } = data;

    const recipe = await this.prisma.recipe.update({
      where: {
        id,
        user: { id: userId },
      },
      data: {
        ...remainingData,
        imageUrl: undefined,
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
}
