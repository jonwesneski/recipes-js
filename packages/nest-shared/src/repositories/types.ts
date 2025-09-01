import { Prisma } from '@repo/database';

export type RecipeMinimalPrismaType = Prisma.RecipeGetPayload<{
  include: {
    user: { select: { handle: true; id: true; imageUrl: true } };
    recipeTags: {
      include: {
        tag: {
          select: { name: true };
        };
      };
    };
  };
  omit: {
    userId: true;
    createdAt: true;
    updatedAt: true;
    preparationTimeInMinutes: true;
    cookingTimeInMinutes: true;
    isPublic: true;
  };
}>;

export type RecipePrismaType = Prisma.RecipeGetPayload<{
  include: {
    user: { select: { handle: true; id: true; imageUrl: true } };
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
  omit: { userId: true };
}>;

export const RecipeInclude = {
  include: {
    user: { select: { handle: true, id: true, imageUrl: true } },
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
  },
  omit: { userId: true },
} as const;

export type RecipeUserType = { id: string; handle: string };
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

type IngredientCreateType = Prisma.IngredientGetPayload<{
  omit: {
    id: true;
    stepId: true;
    displayOrder: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

type StepCreateType = Prisma.StepGetPayload<{
  omit: {
    id: true;
    createdAt: true;
    updatedAt: true;
    recipeId: true;
    displayOrder: true;
    imageUrl: true;
  };
}> & {
  ingredients: IngredientCreateType[];
};

export type RecipeCreateType = Prisma.RecipeGetPayload<{
  include: {
    nutritionalFacts: {
      omit: {
        id: true;
        createdAt: true;
        updatedAt: true;
        recipeId: true;
        userId: true;
      };
    };
  };
  omit: {
    id: true;
    userId: true;
    createdAt: true;
    updatedAt: true;
    imageUrl: true;
  };
}> & { steps: StepCreateType[]; tags: string[]; equipments: string[] };

type IngredientUpdateType = Prisma.IngredientGetPayload<{
  omit: {
    id: true;
    stepId: true;
    displayOrder: true;
    createdAt: true;
    updatedAt: true;
  };
}> & { id?: string };

type StepUpdateType = Prisma.StepGetPayload<{
  omit: {
    createdAt: true;
    updatedAt: true;
    recipeId: true;
    displayOrder: true;
    imageUrl: true;
  };
}> & {
  ingredients: IngredientUpdateType[];
};

type _RecipeUpdateType = Prisma.RecipeGetPayload<{
  include: {
    nutritionalFacts: {
      omit: {
        id: true;
        createdAt: true;
        updatedAt: true;
        recipeId: true;
        userId: true;
      };
    };
  };
  omit: {
    id: true;
    userId: true;
    createdAt: true;
    updatedAt: true;
    imageUrl: true;
  };
}> & { steps: StepUpdateType[]; tags: string[]; equipments: string[] };

type DeepOptionalUndefined<T, A> = {
  [K in keyof T]?: T[K] extends string[] // If it's a string[], keep as string[]
    ? T[K]
    : // If it's a "A or A[]" Type, keep as that type
      T[K] extends A | A[]
      ? T[K]
      : // If it's any array, keep as that array type
        T[K] extends Array<infer U>
        ? Array<DeepOptionalUndefined<U, A>>
        : // If it's an object, recurse
          T[K] extends object
          ? DeepOptionalUndefined<T[K], A>
          : // Otherwise, allow undefined
            T[K] | undefined;
};

export type RecipeUpdateType = DeepOptionalUndefined<
  _RecipeUpdateType,
  IngredientUpdateType
>;
