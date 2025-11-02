'use client'

import { aiControllerRecipesSearchV1 } from '@repo/codegen/ai'
import type {
  AiRecipesSearchResponse,
  RecipeListResponse,
} from '@repo/codegen/model'
import {
  createRecipesListStore,
  defaultInitState,
  type RecipesListStore,
} from '@src/stores/recipes-list-store'
import { specificPrimitiveToStringSchema } from '@src/zod-schemas/primitive'
import { useRouter } from 'next/navigation'
import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

type RecipesListStoreApi = ReturnType<typeof createRecipesListStore>
export type RecipesListStoreContextType = {
  recipes: RecipeListResponse['data']
  aiFetchRecipes: (_input: string) => Promise<void>
  setRecipes: (_value: RecipeListResponse) => void
}
export const RecipesListStoreContext =
  createContext<RecipesListStoreContextType | null>(null)

export interface RecipesListStoreProviderProps {
  children: ReactNode
  initialState?: Partial<RecipesListStore>
}

export const RecipesListStoreProvider = ({
  children,
  initialState,
}: RecipesListStoreProviderProps) => {
  const router = useRouter()
  const storeRef = useRef<RecipesListStoreApi | null>(null)
  storeRef.current ??= createRecipesListStore({
    ...defaultInitState,
    ...initialState,
  })
  const store = useStore(storeRef.current)

  const aiFetchRecipes = async (input: string) => {
    const recipes = await aiControllerRecipesSearchV1({ input })
    store.setRecipes({
      ...recipes,
      filters: recipes.generatedFilters,
    })

    const paramsString = _makeQueryParamsString(recipes)
    const newUrl = `/recipes${paramsString !== '' ? `?${paramsString}` : ''}`
    router.push(newUrl)
  }

  const _makeQueryParamsString = (recipes: AiRecipesSearchResponse) => {
    const params = new URLSearchParams()
    for (const key of Object.keys(recipes.generatedFilters)) {
      const value =
        recipes.generatedFilters[key as keyof typeof recipes.generatedFilters]
      if (Array.isArray(value)) {
        for (const v of value) {
          params.set(key, v)
        }
      } else {
        const data = specificPrimitiveToStringSchema.safeParse(value).data
        if (data) {
          params.set(key, data)
        }
      }
    }
    if (recipes.generatedFilters.diets) {
      params.set('dietsOperator', recipes.generatedFilters.diets.operator)
    }
    if (recipes.generatedFilters.proteins) {
      params.set('proteinsOperator', recipes.generatedFilters.proteins.operator)
    }

    return params.toString()
  }

  return (
    <RecipesListStoreContext.Provider
      value={{
        recipes: store.data,
        aiFetchRecipes,
        setRecipes: store.setRecipes,
      }}
    >
      {children}
    </RecipesListStoreContext.Provider>
  )
}

export const useRecipesListStore = () => {
  const context = useContext(RecipesListStoreContext)
  if (!context) {
    throw new Error(
      `${useRecipesListStore.name} must be used within a ${RecipesListStoreProvider.name}`,
    )
  }
  return context
}
