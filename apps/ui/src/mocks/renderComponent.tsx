import AppProviders from '@src/app/_providers'
import * as CameraContext from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { type UserStore } from '@src/stores/user-store'
import { type NormalizedRecipe } from '@src/zod-schemas/recipeNormalized'
import { render, waitFor } from '@testing-library/react'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const renderComponent = async (
  ui: React.ReactNode,
  initialState: Partial<UserStore> = { id: '123' },
) => {
  const routerMock = {
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }
  const result = render(
    <AppRouterContext.Provider value={routerMock}>
      <AppProviders initialState={initialState}>{ui}</AppProviders>
    </AppRouterContext.Provider>,
  )
  await waitFor(
    () => {
      if (!result.container.firstChild) throw new Error('timed out mounting')
    },
    { timeout: 3000 },
  )
  return { ...result, routerMock }
}

export const renderRecipeComponent = async (
  ui: React.ReactNode,
  initialState?: Partial<{
    recipe: Partial<NormalizedRecipe>
    user: Partial<UserStore>
  }>,
) => {
  const useCameraMock = { takePhoto: jest.fn().mockResolvedValue('123') }
  jest.spyOn(CameraContext, 'useCamera').mockImplementation(() => useCameraMock)

  return {
    ...(await renderComponent(
      <RecipeStoreProvider initialState={initialState?.recipe ?? {}}>
        {ui}
      </RecipeStoreProvider>,
      initialState?.user,
    )),
    useCameraMock,
  }
}
