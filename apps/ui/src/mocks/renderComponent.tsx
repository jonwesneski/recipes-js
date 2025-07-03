import { ModalStoreProvider } from '@repo/ui'
import { AuthenticationProvider } from '@src/providers/authentication-provider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { UserStoreProvider } from '@src/providers/use-store-provider'
import { type RecipeStore } from '@src/stores/recipe-store'
import { render } from '@testing-library/react'

export const renderComponent = (
  ui: React.ReactNode,
  initialState?: Partial<RecipeStore>,
) => {
  return render(
    <AuthenticationProvider>
      <UserStoreProvider>
        <ModalStoreProvider>
          <RecipeStoreProvider initialState={initialState}>
            {ui}
          </RecipeStoreProvider>
        </ModalStoreProvider>
      </UserStoreProvider>
    </AuthenticationProvider>,
  )
}
