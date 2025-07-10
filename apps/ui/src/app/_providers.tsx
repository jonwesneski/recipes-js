'use client'

import { ModalRoot, ModalStoreProvider } from '@repo/ui'
import { AuthenticationProvider } from '@src/providers/authentication-provider'
import { UserStoreProvider } from '@src/providers/use-store-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>
        <UserStoreProvider>
          <ModalStoreProvider>
            {children}
            <ModalRoot />
          </ModalStoreProvider>
        </UserStoreProvider>
      </QueryClientProvider>
    </AuthenticationProvider>
  )
}
export default AppProviders
