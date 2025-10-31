import { aiControllerRecipesSearchV1 } from '@repo/codegen/ai'
import { RecipeListResponse } from '@repo/codegen/model'
import {
  createRecipesListStore,
  defaultInitState,
  type RecipesListStore,
} from '@src/stores/recipes-list-store'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, type ReactNode, useContext, useRef } from 'react'

type RecipesListStoreApi = ReturnType<typeof createRecipesListStore>
export type RecipesListStoreContextType = {
  recipes: RecipeListResponse['data']
  aiFetchRecipes: (_input: string) => Promise<void>
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
  const storeRef = useRef<RecipesListStoreApi | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  storeRef.current ??= createRecipesListStore({
    ...defaultInitState,
    ...initialState,
  })

  const aiFetchRecipes = async (input: string) => {
    const recipes = await aiControllerRecipesSearchV1({ input })
    storeRef.current?.setState({
      ...recipes,
      filters: recipes.generatedFilters,
    })
    if (pathname !== '/recipes') {
      router.push('/recipes')
    }
  }

  return (
    <RecipesListStoreContext.Provider
      value={{ recipes: storeRef.current.getState().data, aiFetchRecipes }}
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
