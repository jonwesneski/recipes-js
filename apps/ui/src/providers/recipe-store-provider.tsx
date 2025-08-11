'use client'

import {
  type RecipeStore,
  createRecipeStore,
  defaultInitState,
} from '@src/stores/recipe-store'
import { type IngredientValidator } from '@src/utils/ingredientsValidator'
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
    ...defaultInitState,
    ...initialState,
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
  ref: RefObject<HTMLDivElement | null>,
) => {
  const {
    steps,
    // setIngredients: _stepIngredients,
    insertIngredientsSteps: _insertIngredientsSteps,
    addIngredient: _addIngredient,
    removeIngredient: _removeIngredient,
    updateIngredient: _updateIngredient,
  } = useRecipeStore((state) => state)
  const step = steps.find((s) => s.ingredients.ref === ref)
  return {
    ingredients: step?.ingredients,
    // ingredientsRef: step?.ingredients.ref,
    // shouldBeFocused: step?.shouldIngredientsBeFocused,
    // setIngredients: (ingredients: IngredientsValidator) =>
    //   _stepIngredients(ref, ingredients),
    insertIngredientsSteps: (
      _ref: RefObject<HTMLTextAreaElement | null>,
      ingredients: IngredientValidator[][],
    ) => _insertIngredientsSteps(_ref, ingredients),
    addIngredient: (_ref: React.RefObject<HTMLTextAreaElement | null>) =>
      _addIngredient(_ref),
    removeIngredient: (_ref: React.RefObject<HTMLTextAreaElement | null>) =>
      _removeIngredient(_ref),
    updateIngredient: (
      _ref: React.RefObject<HTMLTextAreaElement | null>,
      ingredient: IngredientValidator,
    ) => _updateIngredient(_ref, ingredient),
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
  const step = steps.find((s) => s.instructions.ref === ref)
  return {
    instructions: step?.instructions,
    setInstructions: (instructions: string) =>
      _stepInstructions(ref, instructions),
    insertInstructionsSteps: (instructions: string[]) =>
      _insertInstructionsSteps(ref, instructions),
  }
}
