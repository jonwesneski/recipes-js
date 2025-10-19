'use client'

import { type RecipeResponse } from '@repo/codegen/model'
import {
  IngredientItemType,
  InstructionsType,
  type RecipeState,
  type RecipeStore,
  createIngredientsItem,
  createRecipeStore,
  createStepItem,
  defaultInitState,
} from '@src/stores/recipe-store'
import { IngredientValidator } from '@src/utils/ingredientsValidator'
import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

const transformRecipe = (recipe?: Partial<RecipeResponse>): RecipeState => {
  return {
    ...defaultInitState,
    ...recipe,
    imageSrc: recipe?.imageUrl ?? null,
    steps:
      recipe?.steps?.map((s) => {
        return createStepItem({
          ingredients: createIngredientsItem(
            s.ingredients.map(
              (i) =>
                new IngredientItemType({
                  ingredient: new IngredientValidator({
                    dto: {
                      amount: i.amount,
                      isFraction: i.isFraction,
                      unit: i.unit,
                      name: i.name,
                    },
                  }),
                }),
            ),
          ),
          instructions: new InstructionsType({
            value: s.instruction ?? undefined,
          }),
        })
      }) ??
      // Need to re-create steps since it is an array and I don't want to update original.
      // Also need to do a .map() instead of a spread here because ZodError doesn't get
      // fully cloned in a spread of structuredClone()
      defaultInitState.steps.map((s) =>
        createStepItem({
          ingredients: createIngredientsItem(
            s.ingredients.items.map(
              (i) =>
                new IngredientItemType({
                  ingredient: new IngredientValidator({
                    stringValue: i.ingredient.stringValue,
                  }),
                }),
            ),
          ),
          instructions: new InstructionsType({
            value: s.instructions.value,
          }),
        }),
      ),
  }
}

export type RecipeStoreApi = ReturnType<typeof createRecipeStore>
export const RecipeStoreContext = createContext<RecipeStoreApi | null>(null)

export interface RecipeStoreProviderProps {
  children: ReactNode
  initialState?: Partial<RecipeResponse>
}
export const RecipeStoreProvider = ({
  children,
  initialState,
}: RecipeStoreProviderProps) => {
  const storeRef = useRef<RecipeStoreApi | null>(null)

  storeRef.current ??= createRecipeStore(transformRecipe(initialState))

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

export const useRecipeStepIngredientsStore = (keyId: string) => {
  const {
    steps,
    insertIngredientsSteps,
    addIngredient,
    removeIngredient,
    updateIngredient,
  } = useRecipeStore((state) => state)
  const step = steps.find((s) => s.ingredients.keyId === keyId)
  return {
    ingredients: step?.ingredients,
    insertIngredientsSteps,
    addIngredient,
    removeIngredient,
    updateIngredient,
  }
}

export const useRecipeStepInstructionsStore = (keyId: string) => {
  const { steps, setInstructions, insertInstructionsSteps } = useRecipeStore(
    (state) => state,
  )
  const step = steps.find((s) => s.instructions.keyId === keyId)
  return {
    instructions: step?.instructions,
    setInstructions,
    insertInstructionsSteps,
  }
}
