'use client'

import {
  type CreateRecipeDto,
  type NutritionalFactsDto,
} from '@repo/recipes-codegen/model'
import { IngredientsValidator } from '@src/utils/ingredientsValidator'
import {
  createContext,
  createRef,
  type ReactNode,
  type RefObject,
  useContext,
  useState,
} from 'react'

export type StepsItemsType = {
  id: string
  ref: RefObject<HTMLDivElement | null>
  ingredientRef: RefObject<HTMLTextAreaElement | null>
  ingredients: IngredientsValidator
  instruction: string
}

export type RecipeType = Omit<CreateRecipeDto, 'steps'> & {
  editEnabled: boolean
  setName: (_value: string) => void
  setDescription: (_value: string) => void
  setPreparationTimeInMinutes: (_value: number) => void
  setCookingTimeInMinutes: (_value: number) => void
  steps: StepsItemsType[]
  addStep: () => void
  insertIngredientsSteps: (
    _stepId: string,
    _ingredients: IngredientsValidator[],
  ) => void
  removeStep: (_stepId: string) => void
  setIngredients: (_stepId: string, _ingredients: IngredientsValidator) => void
  setNutritionalFacts: (_value: NutritionalFactsDto) => void
  setTags: (_value: string[]) => void
}
export const RecipeContext = createContext<RecipeType | null>(null)

export interface RecipeProviderProps {
  enableEdit: boolean
  children: ReactNode
}
export const RecipeProvider = ({
  enableEdit,
  children,
}: RecipeProviderProps) => {
  const [editEnabled, _setEditEnabled] = useState<boolean>(enableEdit)
  const [name, setName] = useState<string>('')
  const [slug, _setSlug] = useState<string>('')
  const [description, setDescription] = useState<string | null>(null)
  const [preparationTimeInMinutes, setPreparationTimeInMinutes] = useState<
    number | null
  >(null)
  const [cookingTimeInMinutes, setCookingTimeInMinutes] = useState<
    number | null
  >(null)
  const [steps, _setSteps] = useState<StepsItemsType[]>([createStepItem()])
  const [nutritionalFacts, setNutritionalFacts] =
    useState<NutritionalFactsDto | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const userHandle = ''

  const addStep = () => {
    _setSteps((v) => [...v, createStepItem()])
  }

  const insertIngredientsSteps = (
    stepId: string,
    ingredients: IngredientsValidator[],
  ) => {
    const index = steps.findIndex((s) => s.id === stepId)
    const inserts = ingredients.map((i) => {
      return createStepItem({ ingredients: i })
    })
    if (index !== -1) {
      _setSteps((v) => {
        return v.toSpliced(index + 1, 0, ...inserts)
      })
    } else {
      _setSteps((v) => [...v, ...inserts])
    }
  }

  const removeStep = (stepId: string) => {
    const index = steps.findIndex((s) => s.id === stepId)
    if (index !== -1) {
      _setSteps((v) => v.toSpliced(index, 1))
    }
  }

  const setIngredients = (
    stepId: string,
    ingredients: IngredientsValidator,
  ) => {
    _setSteps((value) => {
      const index = value.findIndex((v) => v.id === stepId)
      if (index !== -1) {
        value[index].ingredients = ingredients
      }
      return value
    })
  }

  return (
    <RecipeContext.Provider
      value={{
        editEnabled,
        name,
        setName,
        slug,
        description,
        setDescription,
        preparationTimeInMinutes,
        setPreparationTimeInMinutes,
        cookingTimeInMinutes,
        setCookingTimeInMinutes,
        steps,
        addStep,
        insertIngredientsSteps,
        removeStep,
        setIngredients,
        nutritionalFacts,
        setNutritionalFacts,
        tags,
        setTags,
        userHandle,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}

const createStepItem = (params?: {
  ingredients?: IngredientsValidator
  instructions?: string
}) => {
  return {
    id: crypto.randomUUID(),
    ref: createRef<HTMLDivElement>(),
    ingredientRef: createRef<HTMLTextAreaElement>(),
    ingredients: params?.ingredients ?? new IngredientsValidator({ dto: [] }),
    instruction: params?.instructions ?? '',
  }
}

export const useRecipe = () => {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error(
      `${useRecipe.name} must be used within a ${RecipeProvider.name}`,
    )
  }
  return context
}
