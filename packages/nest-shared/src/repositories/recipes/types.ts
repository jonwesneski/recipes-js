import { Prisma } from '@repo/database';

export type PublicRecipesSearch = Omit<Prisma.RecipeWhereInput, 'isPublic'>;

export const RecipeMinimalPrismaInclude = {
  include: {
    user: { select: { handle: true, id: true, imageUrl: true } },
    recipeTags: {
      include: { tag: { select: { name: true } } },
    },
    _count: {
      select: {
        bookmarkedBy: { where: { userId: '' } },
      },
    },
  },
  omit: {
    userId: true,
    createdAt: true,
    updatedAt: true,
    isPublic: true,
  },
  orderBy: { updatedAt: 'desc' },
} as const;

export type RecipeMinimalPrismaType = Prisma.RecipeGetPayload<
  typeof RecipeMinimalPrismaInclude
>;

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
    _count: {
      select: {
        bookmarkedBy: { where: { userId: '' } },
      },
    },
  },
  omit: { userId: true },
} as const;
export type RecipePrismaType = Prisma.RecipeGetPayload<typeof RecipeInclude>;

export type RecipeUserType = {
  id: string;
  handle: string;
  imageUrl: string | null;
};
export type RecipeType = Omit<
  RecipePrismaType,
  'recipeTags' | 'userId' | 'isPublic' | 'equipments' | '_count'
> & {
  tags: string[];
  equipments: string[];
  user: RecipeUserType;
  isPublic?: boolean;
  bookmarked?: boolean;
};
export type RecipeMinimalType = Omit<
  RecipeMinimalPrismaType,
  'recipeTags' | 'userId' | '_count'
> & {
  tags: string[];
  user: RecipeUserType;
  bookmarked?: boolean;
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
