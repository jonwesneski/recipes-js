import {
  getAiControllerRecipesSearchV1MockHandler,
  getAiControllerRecipesSearchV1ResponseMock,
  getAiMock,
} from '@repo/codegen/mswAi';
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
  getUsersControllerFollowingsV1MockHandler,
  getUsersControllerFollowingsV1ResponseMock,
  getUsersControllerUserAccountV1MockHandler,
  getUsersControllerUserAccountV1ResponseMock,
  getUsersControllerUserV1MockHandler,
  getUsersControllerUserV1ResponseMock,
  getUsersMock,
} from '@repo/codegen/mswUsers';
import { ws } from 'msw';

const websocketMock = ws.link(/^ws:\/\/localhost:3001\/socket\.io\/.*/);

const recipesList = getRecipesControllerRecipesListV1ResponseMock();
recipesList.data.forEach((r) => {
  r.imageUrl = null;
});
const aiRecipesList = getAiControllerRecipesSearchV1ResponseMock();
aiRecipesList.data.forEach((r) => {
  r.imageUrl = null;
});
const recipe = getRecipesControllerRecipeV1ResponseMock({ imageUrl: null });
recipe.user.imageUrl = null;
recipe.steps.forEach((s) => {
  s.imageUrl = null;
});
const followersList = getUsersControllerFollowingsV1ResponseMock();
followersList.data.forEach((f) => {
  f.imageUrl = null;
});

export default [
  websocketMock.addEventListener('connection', ({ client }) => {
    client.send(
      '0{"sid":"msw-mock-sid","upgrades":[],"pingInterval":25000,"pingTimeout":5000}',
    );
    client.send('40');
  }),
  ...getHealthCheckMock(),
  // UsersControllerUserAccount needs to be above UsersControllerUser because of route handling
  getUsersControllerUserAccountV1MockHandler(
    getUsersControllerUserAccountV1ResponseMock({ imageUrl: null }),
  ),
  getUsersControllerUserV1MockHandler(
    getUsersControllerUserV1ResponseMock({ imageUrl: null }),
  ),
  getUsersControllerFollowingsV1MockHandler(followersList),
  ...getUsersMock(),
  getRecipesControllerRecipesListV1MockHandler(recipesList),
  getRecipesControllerRecipeV1MockHandler(recipe),
  ...getRecipesMock(),
  ...getTagsMock(),
  getAiControllerRecipesSearchV1MockHandler(aiRecipesList),
  ...getAiMock(),
];
