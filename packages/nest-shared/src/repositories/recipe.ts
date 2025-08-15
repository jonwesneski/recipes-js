import { Injectable } from '@nestjs/common';
import { createId as cuid } from '@paralleldrive/cuid2';
// import { PrismaService } from 'src/common';
import { PrismaService } from '../services/prisma.service';
import {
  RecipeCreateType,
  RecipeInclude,
  RecipeUpdateType,
  type RecipeMinimalPrismaType,
  type RecipeMinimalType,
  type RecipePrismaType,
  type RecipeType,
  type RecipeUserType,
} from './recipe.types';

@Injectable()
export class RecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async getRecipe(id: string): Promise<RecipeType> {
    const recipe = await this.prisma.recipe.findFirstOrThrow({
      where: {
        id,
      },
      include: RecipeInclude,
    });
    return this.transformRecipe(recipe);
  }

  async createRecipe(
    userId: string,
    data: RecipeCreateType,
  ): Promise<RecipeType> {
    const { tags, ...remainingData } = data;
    const newId = cuid();

    const recipe = await this.prisma.$transaction(async () => {
      const recipe = await this.prisma.recipe.create({
        data: {
          ...remainingData,
          id: newId,
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
        include: RecipeInclude,
      });

      return recipe;
    });

    return this.transformRecipe(recipe);
  }

  async updateRecipe(
    userId: string,
    id: string,
    data: RecipeUpdateType,
  ): Promise<RecipeType> {
    const { tags, ...remainingData } = data;

    const recipe = await this.prisma.$transaction(async () => {
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
        include: RecipeInclude,
      });

      return recipe;
    });

    return this.transformRecipe(recipe);
  }
}
