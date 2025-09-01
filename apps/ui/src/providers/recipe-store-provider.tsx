'use client'

import { type RecipeEntity } from '@repo/codegen/model'
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
import {
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useRef,
} from 'react'
import { useStore } from 'zustand'

const transformRecipe = (recipe?: Partial<RecipeEntity>): RecipeState => {
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
                    dto: { amount: i.amount, unit: i.unit, name: i.name },
                  }),
                }),
            ),
          ),
          instructions: new InstructionsType({
            value: s.instruction ?? undefined,
          }),
        })
      }) ?? defaultInitState.steps,
  }
}

export type RecipeStoreApi = ReturnType<typeof createRecipeStore>
export const RecipeStoreContext = createContext<RecipeStoreApi | null>(null)

export interface RecipeStoreProviderProps {
  children: ReactNode
  initialState?: Partial<RecipeEntity>
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
