'use client'

import {
  type RecipeStore,
  createRecipeStore,
  defaultInitState,
} from '@src/stores/recipeStore'
import type {
  NormalizedIngredient,
  NormalizedRecipe,
} from '@src/zod-schemas/recipeNormalized'
import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

export type RecipeStoreApi = ReturnType<typeof createRecipeStore>
export const RecipeStoreContext = createContext<RecipeStoreApi | null>(null)

export interface RecipeStoreProviderProps {
  children: ReactNode
  initialState?: Partial<NormalizedRecipe>
}
export const RecipeStoreProvider = ({
  children,
  initialState,
}: RecipeStoreProviderProps) => {
  const storeRef = useRef<RecipeStoreApi | null>(null)

  storeRef.current ??= createRecipeStore({
    ...structuredClone(defaultInitState),
    ...structuredClone(initialState),
  })

  return (
    <RecipeStoreContext.Provider value={storeRef.current}>
      {children}
    </RecipeStoreContext.Provider>
  )
}

export const useRecipeStore = <T,>(selector: (_store: RecipeStore) => T): T => {
  const store = useContext(RecipeStoreContext)
  if (!store) {
    throw new Error(
      `${useRecipeStore.name} must be used within a ${RecipeStoreProvider.name}`,
    )
  }
  return useStore(store, selector)
}

export const useRecipeStepIngredientsStore = (stepId: string) => {
  const {
    steps,
    ingredients,
    insertIngredientsSteps,
    addIngredient,
    removeIngredient,
    updateIngredient,
  } = useRecipeStore((state) => state)
  return {
    ingredients: steps[stepId].ingredientIds.reduce<
      Record<string, NormalizedIngredient>
    >((acc, id) => {
      acc[id] = ingredients[id]
      return acc
    }, {}),
    ingredientIds: steps[stepId].ingredientIds,
    insertIngredientsSteps,
    addIngredient,
    removeIngredient,
    updateIngredient,
  }
}

export const useRecipeStepInstructionsStore = (stepId: string) => {
  const { steps, setInstructions, insertInstructionsSteps } = useRecipeStore(
    (state) => state,
  )
  return {
    instructions: steps[stepId].instruction,
    setInstructions,
    insertInstructionsSteps,
  }
}
