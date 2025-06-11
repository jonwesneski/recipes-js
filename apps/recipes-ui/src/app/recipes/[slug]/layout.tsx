'use client'

import { UserStoreProvider } from '../../../providers/use-store-provider';
import { ModalStoreProvider } from '../../../providers/modal-store-provider';
import ModalRoot from '../../ModalRoot';

export default function DefaultRecipeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserStoreProvider>
      <ModalStoreProvider>
        {children}
        <ModalRoot />
      </ModalStoreProvider>
      </UserStoreProvider>
  )
}