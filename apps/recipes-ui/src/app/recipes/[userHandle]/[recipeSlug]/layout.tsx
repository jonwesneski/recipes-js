'use client'

import { ModalRoot, ModalStoreProvider } from '@repo/ui'
import { UserStoreProvider } from '@src/providers/use-store-provider'

const DefaultRecipeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserStoreProvider>
      <ModalStoreProvider>
        {children}
        <ModalRoot />
      </ModalStoreProvider>
    </UserStoreProvider>
  )
}
export default DefaultRecipeLayout
