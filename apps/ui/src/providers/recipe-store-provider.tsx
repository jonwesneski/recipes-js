'use client'

import {
  type RecipeStore,
  createRecipeStore,
  defaultInitState,
} from '@src/stores/recipe-store'
import { type IngredientsValidator } from '@src/utils/ingredientsValidator'
import {
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useRef,
} from 'react'
import { useStore } from 'zustand'

export type RecipeStoreApi = ReturnType<typeof createRecipeStore>
export const RecipeStoreContext = createContext<RecipeStoreApi | null>(null)

export interface RecipeStoreProviderProps {
  children: ReactNode
  initialState?: Partial<RecipeStore>
}
export const RecipeStoreProvider = ({
  children,
  initialState,
}: RecipeStoreProviderProps) => {
  const storeRef = useRef<RecipeStoreApi | null>(null)

  storeRef.current ??= createRecipeStore({
    ...initialState,
    ...defaultInitState,
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

export const useRecipeStepIngredientsStore = (
  ref: RefObject<HTMLTextAreaElement | null>,
) => {
  const {
    steps,
    setIngredients: _stepIngredients,
    insertIngredientsSteps: _insertIngredientsSteps,
  } = useRecipeStore((state) => state)
  const step = steps.find((s) => s.ingredientsRef === ref)
  return {
    ingredients: step?.ingredients,
    ingredientsRef: step?.ingredientsRef,
    shouldBeFocused: step?.shouldIngredientsBeFocused,
    setIngredients: (ingredients: IngredientsValidator) =>
      _stepIngredients(ref, ingredients),
    insertIngredientsSteps: (ingredients: IngredientsValidator[]) =>
      _insertIngredientsSteps(ref, ingredients),
  }
}

export const useRecipeStepInstructionsStore = (
  ref: RefObject<HTMLTextAreaElement | null>,
) => {
  const {
    steps,
    setInstructions: _stepInstructions,
    insertInstructionsSteps: _insertInstructionsSteps,
  } = useRecipeStore((state) => state)
  const step = steps.find((s) => s.instructionsRef === ref)
  return {
    instructions: step?.instructions,
    instructionsRef: step?.instructionsRef,
    shouldBeFocused: step?.shouldInstructionsBeFocused,
    setInstructions: (instructions: string) =>
      _stepInstructions(ref, instructions),
    insertInstructionsSteps: (instructions: string[]) =>
      _insertInstructionsSteps(ref, instructions),
  }
}
