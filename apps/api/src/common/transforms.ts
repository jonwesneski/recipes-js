import { GetPublicRecipesQueryParams } from '@repo/nest-shared';
import { GetRecipesDto } from '@src/recipes';
import { OperatorEnum } from './common.dtos';

export const recipesDtoToQueryParams = (params: GetRecipesDto) => {
  const query: GetPublicRecipesQueryParams = {
    where: {
      userId: params.filters?.userId,
    },
    cursorId: params.pagination?.cursorId,
    take: params.pagination?.take,
    skip: params.pagination?.skip,
  };

  if (params.filters?.cuisines) {
    query.where.cuisine = { in: params.filters.cuisines };
  }

  if (params.filters?.meals) {
    query.where.meal = { in: params.filters.meals };
  }

  if (params.filters?.dishes) {
    query.where.dish = { in: params.filters.dishes };
  }

  if (params.filters?.difficultyLevels) {
    query.where.difficultyLevel = { in: params.filters.difficultyLevels };
  }

  if (params.filters?.diets) {
    const operator = params.filters.diets.operator;
    query.where.diets =
      operator === OperatorEnum.And
        ? { hasEvery: params.filters.diets.values }
        : { hasSome: params.filters.diets.values };
  }

  if (params.filters?.proteins) {
    const operator = params.filters.proteins.operator;
    query.where.proteins =
      operator === OperatorEnum.Or
        ? { hasSome: params.filters.proteins.values }
        : { hasEvery: params.filters.proteins.values };
  }

  return query;
};
