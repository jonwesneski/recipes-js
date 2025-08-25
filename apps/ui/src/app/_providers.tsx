'use client'

import { ModalRoot, ModalStoreProvider } from '@repo/design-system'
import { AuthenticationProvider } from '@src/providers/authentication-provider'
import { UserStoreProvider } from '@src/providers/use-store-provider'
import { type UserStore } from '@src/stores/user-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import type { SetupWorker } from 'msw/browser'
import { useEffect } from 'react'

const queryClient = new QueryClient()

interface AppProvidersProps {
  children: React.ReactNode
  initialState?: Partial<UserStore>
}
const AppProviders = (props: AppProvidersProps) => {
  useEffect(() => {
    // import('@src/mocks/mswBrowser')
    //   .then((mod: { worker: SetupWorker }) => {
    //     void mod.worker.start()
    //   })
    //   .catch((error: unknown) => {
    //     console.error('Failed to start MSW server:', error)
    //   })
  }, [])

  return (
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>
        <UserStoreProvider initialState={props.initialState}>
          <ModalStoreProvider>
            {props.children}
            <ModalRoot />
          </ModalStoreProvider>
        </UserStoreProvider>
      </QueryClientProvider>
    </AuthenticationProvider>
  )
}
export default AppProviders
