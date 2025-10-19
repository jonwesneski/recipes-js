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
  getUsersControllerFollowersV1MockHandler,
  getUsersControllerFollowersV1ResponseMock,
  getUsersControllerUserAccountV1MockHandler,
  getUsersControllerUserAccountV1ResponseMock,
  getUsersControllerUserV1MockHandler,
  getUsersControllerUserV1ResponseMock,
  getUsersMock,
} from '@repo/codegen/mswUsers';

const recipesList = getRecipesControllerRecipesListV1ResponseMock();
recipesList.data.forEach((r) => {
  r.imageUrl = null;
});
const recipe = getRecipesControllerRecipeV1ResponseMock({ imageUrl: null });
recipe.user.imageUrl = null;
recipe.steps.forEach((s) => {
  s.imageUrl = null;
});
const followersList = getUsersControllerFollowersV1ResponseMock();
followersList.forEach((f) => {
  f.imageUrl = null;
});

export default [
  ...getHealthCheckMock(),
  getUsersControllerUserV1MockHandler(
    getUsersControllerUserV1ResponseMock({ imageUrl: null }),
  ),
  getUsersControllerUserAccountV1MockHandler(
    getUsersControllerUserAccountV1ResponseMock({ imageUrl: null }),
  ),
  getUsersControllerFollowersV1MockHandler(followersList),
  ...getUsersMock(),
  getRecipesControllerRecipesListV1MockHandler(recipesList),
  getRecipesControllerRecipeV1MockHandler(recipe),
  ...getRecipesMock(),
  ...getTagsMock(),
  ...getAiMock(),
];
