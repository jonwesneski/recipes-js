import { type RecipeEntity } from '@repo/codegen/model'
import AppProviders from '@src/app/_providers'
import * as CameraContext from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { type UserStore } from '@src/stores/user-store'
import { render } from '@testing-library/react'

export const renderComponent = (
  ui: React.ReactNode,
  initialState?: { user: Partial<UserStore> },
) => {
  return render(
    <AppProviders initialState={initialState?.user}>{ui}</AppProviders>,
  )
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
