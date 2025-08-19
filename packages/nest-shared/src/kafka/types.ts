export const NEW_RECIPE_IMAGE_TOPIC = 'new_recipe_image';
export const NEW_RECIPE_STEP_IMAGE_TOPIC = 'new_recipe_step_image';
export type RecipeTopics =
  | typeof NEW_RECIPE_IMAGE_TOPIC
  | typeof NEW_RECIPE_STEP_IMAGE_TOPIC;

export type NewRecipeMessageType = {
  recipeId: string;
  base64Image: string;
};

export type NewRecipeStepMessageType = {
  recipeId: string;
  stepId: string;
  stepIndex: number;
  base64Image: string;
};

export type RecipeMessageTypes =
  | NewRecipeMessageType
  | NewRecipeStepMessageType;

export type TopicOptionsMap = Record<RecipeTopics, RecipeMessageTypes>;
