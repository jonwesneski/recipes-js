'use client'

import {
  type CreateRecipeDto,
  type IngredientDto,
  type NutritionalFactsDto,
  type StepDto,
} from '@repo/recipes-codegen/models'
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react'

export type StepsItemsType = {
  id: string
  step: StepDto
}
export type RecipeType = Omit<CreateRecipeDto, 'steps'> & {
  setName: (_value: string) => void
  setDescription: (_value: string) => void
  setPreparationTimeInMinutes: (_value: number) => void
  setCookingTimeInMinutes: (_value: number) => void
  steps: StepsItemsType[]
  setSteps: Dispatch<SetStateAction<StepsItemsType[]>>
  addStep: () => void
  setIngredients: (_stepId: string, _ingredients: IngredientDto[]) => void
  setNutritionalFacts: (_value: NutritionalFactsDto) => void
  setTags: (_value: string[]) => void
}
export const RecipeContext = createContext<RecipeType | null>(null)

export interface RecipeProviderProps {
  children: ReactNode
}

export const RecipeProvider = ({ children }: RecipeProviderProps) => {
  const [name, setName] = useState<string>('')
  const [slug, _setSlug] = useState<string>('')
  const [description, setDescription] = useState<string | null>(null)
  const [preparationTimeInMinutes, setPreparationTimeInMinutes] = useState<
    number | null
  >(null)
  const [cookingTimeInMinutes, setCookingTimeInMinutes] = useState<
    number | null
  >(null)
  const [steps, setSteps] = useState<StepsItemsType[]>([
    { id: crypto.randomUUID(), step: { ingredients: [], instruction: '' } },
  ])
  const [nutritionalFacts, setNutritionalFacts] =
    useState<NutritionalFactsDto | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const userHandle = ''

  const addStep = () => {
    setSteps((v) => [...v, { id: crypto.randomUUID(), step: {} as StepDto }])
  }

  const setIngredients = (stepId: string, ingredients: IngredientDto[]) => {
    setSteps((value) => {
      const index = value.findIndex((v) => v.id === stepId)
      if (index !== -1) {
        value[index].step.ingredients = ingredients
      }
      return value
    })
  }

  return (
    <RecipeContext.Provider
      value={{
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
        setSteps,
        addStep,
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

export const useRecipe = () => {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error(
      `${useRecipe.name} must be used within a ${RecipeProvider.name}`,
    )
  }
  return context
}
