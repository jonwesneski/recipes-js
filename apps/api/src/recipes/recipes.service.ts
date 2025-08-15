import { Injectable } from '@nestjs/common';
import { createId as cuid } from '@paralleldrive/cuid2';
import { Prisma } from '@repo/database';
// import { PrismaService } from 'src/common';
import { RecipeRepository, RekognitionService } from '@repo/nest-shared';
import { S3Service } from 'src/common/s3.service';
import { CreateRecipeDto, PatchRecipeDto } from './contracts';

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
    private readonly recipeRepository: RecipeRepository,
    private readonly recognitionService: RekognitionService,
    private readonly s3Service: S3Service,
  ) {}

  async getRecipes(): Promise<RecipeMinimalType[]> {
    return await this.recipeRepository.getRecipes();
  }

  async getRecipe(id: string): Promise<RecipeType> {
    return await this.recipeRepository.getRecipe(id);
  }

  async createRecipe(
    userId: string,
    data: CreateRecipeDto,
  ): Promise<RecipeType> {
    const recipe = await this.recipeRepository.createRecipe(userId, data);
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

    return recipe;
  }

  async updateRecipe(
    userId: string,
    id: string,
    data: PatchRecipeDto,
  ): Promise<RecipeType> {
    const recipe = await this.recipeRepository.updateRecipe(userId, id, data);
    const { base64Image, tags, ...remainingData } = data;
    const s3BucketKeyName = `${userId}/${id}`;
    const imageUrl = base64Image
      ? `${this.s3Service.cloudFrontBaseUrl}/${s3BucketKeyName}`
      : undefined;

    return recipe;
  }
}
