import { ModalRoot, ModalStoreProvider } from '@repo/design-system'
import InitProvider from '@src/providers/InitProvider'
import { NotificationProvider } from '@src/providers/NotificationProvider'
import { AuthenticationProvider } from '@src/providers/authentication-provider'
import { UserStoreProvider } from '@src/providers/use-store-provider'
import { type UserStore } from '@src/stores/user-store'

interface AppProvidersProps {
  children: React.ReactNode
  initialState?: Partial<UserStore>
}
const AppProviders = (props: AppProvidersProps) => {
  return (
    <AuthenticationProvider>
      <InitProvider>
        <UserStoreProvider initialState={props.initialState}>
          <ModalStoreProvider>
            <NotificationProvider>{props.children}</NotificationProvider>
            <ModalRoot />
          </ModalStoreProvider>
        </UserStoreProvider>
      </InitProvider>
    </AuthenticationProvider>
  )
}
export default AppProviders
