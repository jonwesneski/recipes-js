'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserStoreProvider } from '../../../providers/use-store-provider';
import { ModalStoreProvider } from '../../../providers/modal-store-provider';
import ModalRoot from '../../ModalRoot';

const queryClient = new QueryClient();

export default function DefaultRecipeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserStoreProvider>
        <ModalStoreProvider>
          {children}
          <ModalRoot />
        </ModalStoreProvider>
       </UserStoreProvider>
    </QueryClientProvider>
  )
}