import type { RecipeFiltersDto, RecipeListResponse } from '@repo/codegen/model';
import { createStore } from 'zustand';

export type RecipesState = RecipeListResponse & {
  filters?: RecipeFiltersDto;
};

export type RecipeActions = {
  setRecipes: (_value: RecipesState) => void;
};

export type RecipesListStore = RecipesState & RecipeActions;

export const defaultInitState: RecipesState = {
  data: [],
  pagination: {
    totalRecords: 0,
    currentCursor: null,
    nextCursor: null,
  },
};

export const createRecipesListStore = (
  initState: RecipesState = defaultInitState,
) => {
  return createStore<RecipesListStore>()((set) => ({
    ...initState,
    setRecipes: (recipes) => {
      set(() => ({ ...recipes }));
    },
  }));
};
