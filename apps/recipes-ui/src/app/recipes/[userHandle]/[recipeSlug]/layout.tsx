'use client'

import { ModalStoreProvider } from '../../../../providers/modal-store-provider'
import { UserStoreProvider } from '../../../../providers/use-store-provider'
import { ModalRoot } from '../../../ModalRoot'

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
