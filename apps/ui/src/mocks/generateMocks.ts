import { getAiMock } from '@repo/codegen/mswAi';
import { getHealthCheckMock } from '@repo/codegen/mswHealthCheck';
import {
  getRecipesControllerRecipesListV1MockHandler,
  getRecipesControllerRecipesListV1ResponseMock,
  getRecipesControllerRecipeV1MockHandler,
  getRecipesControllerRecipeV1ResponseMock,
  getRecipesMock,
} from '@repo/codegen/mswRecipes';
import { getTagsMock } from '@repo/codegen/mswTags';
import {
  getUsersControllerUserV1MockHandler,
  getUsersControllerUserV1ResponseMock,
  getUsersMock,
} from '@repo/codegen/mswUsers';

const recipesList = getRecipesControllerRecipesListV1ResponseMock();
recipesList.forEach((r) => {
  r.imageUrl = null;
});
const recipe = getRecipesControllerRecipeV1ResponseMock({ imageUrl: null });
recipe.user.imageUrl = null;
recipe.steps.forEach((s) => {
  s.imageUrl = null;
});

export default [
  ...getHealthCheckMock(),
  getUsersControllerUserV1MockHandler(
    getUsersControllerUserV1ResponseMock({ imageUrl: null }),
  ),
  ...getUsersMock(),
  getRecipesControllerRecipesListV1MockHandler(recipesList),
  getRecipesControllerRecipeV1MockHandler(recipe),
  ...getRecipesMock(),
  ...getTagsMock(),
  ...getAiMock(),
];
