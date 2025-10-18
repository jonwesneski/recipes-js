import { type RecipeEntity } from '@repo/codegen/model'
import AppProviders from '@src/app/_providers'
import * as CameraContext from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { type UserStore } from '@src/stores/user-store'
import { render } from '@testing-library/react'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const renderComponent = (
  ui: React.ReactNode,
  initialState?: { user: Partial<UserStore> },
) => {
  const routerMock = {
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }
  return {
    ...render(
      <AppRouterContext.Provider value={routerMock}>
        <AppProviders initialState={initialState?.user}>{ui}</AppProviders>
      </AppRouterContext.Provider>,
    ),
    routerMock,
  }
}

export const renderRecipeComponent = (
  ui: React.ReactNode,
  initialState?: { recipe: Partial<RecipeEntity>; user: Partial<UserStore> },
) => {
  const useCameraMock = { takePhoto: jest.fn().mockResolvedValue('123') }
  jest.spyOn(CameraContext, 'useCamera').mockImplementation(() => useCameraMock)

  return {
    ...renderComponent(
      <RecipeStoreProvider initialState={initialState?.recipe}>
        {ui}
      </RecipeStoreProvider>,
      { user: initialState?.user ?? {} },
    ),
    useCameraMock,
  }
}
