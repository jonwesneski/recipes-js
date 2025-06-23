'use client'

import {
  type CreateRecipeDto,
  type NutritionalFactsDto,
} from '@repo/recipes-codegen/model'
import { IngredientsValidator } from '@src/utils/ingredientsValidator'
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
  ingredients: IngredientsValidator
  instruction: string
}
export type RecipeType = Omit<CreateRecipeDto, 'steps'> & {
  setName: (_value: string) => void
  setDescription: (_value: string) => void
  setPreparationTimeInMinutes: (_value: number) => void
  setCookingTimeInMinutes: (_value: number) => void
  steps: StepsItemsType[]
  setSteps: Dispatch<SetStateAction<StepsItemsType[]>>
  addStep: () => void
  insertSteps: (_stepId: string, _ingredients: IngredientsValidator[]) => void
  setIngredients: (_stepId: string, _ingredients: IngredientsValidator) => void
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
    {
      id: crypto.randomUUID(),
      ingredients: new IngredientsValidator({ dto: [] }),
      instruction: '',
    },
  ])
  const [nutritionalFacts, setNutritionalFacts] =
    useState<NutritionalFactsDto | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const userHandle = ''

  const addStep = () => {
    setSteps((v) => [
      ...v,
      {
        id: crypto.randomUUID(),
        ingredients: new IngredientsValidator({ dto: [] }),
        instruction: '',
      },
    ])
  }

  const insertSteps = (stepId: string, ingredients: IngredientsValidator[]) => {
    const index = steps.findIndex((s) => s.id === stepId)
    const inserts = ingredients.map((i) => {
      return {
        id: crypto.randomUUID(),
        ingredients: i,
        instruction: '',
      }
    })
    if (index !== -1) {
      setSteps((v) => {
        return v.toSpliced(index + 1, 0, ...inserts)
      })
    } else {
      setSteps((v) => [...v, ...inserts])
    }
  }

  const setIngredients = (
    stepId: string,
    ingredients: IngredientsValidator,
  ) => {
    setSteps((value) => {
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
        insertSteps,
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
