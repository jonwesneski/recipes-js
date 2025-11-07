import { ModalRoot, ModalStoreProvider } from '@repo/design-system'
import InitProvider from '@src/providers/InitProvider'
import { NotificationProvider } from '@src/providers/NotificationProvider'
import { RecipesListStoreProvider } from '@src/providers/recipes-list-store-provider'
import { UserStoreProvider } from '@src/providers/use-store-provider'
import { type UserStore } from '@src/stores/user-store'

interface AppProvidersProps {
  children: React.ReactNode
  initialState?: Partial<UserStore>
}
const AppProviders = (props: AppProvidersProps) => {
  return (
    <InitProvider>
      <UserStoreProvider initialState={props.initialState}>
        <RecipesListStoreProvider>
          <ModalStoreProvider>
            <NotificationProvider>{props.children}</NotificationProvider>
            <ModalRoot />
          </ModalStoreProvider>
        </RecipesListStoreProvider>
      </UserStoreProvider>
    </InitProvider>
  )
}
export default AppProviders
