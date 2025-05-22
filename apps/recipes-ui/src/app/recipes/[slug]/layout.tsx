'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserStoreProvider } from '../../../providers/use-store-provider';

const queryClient = new QueryClient();

export default function DefaultRecipeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserStoreProvider>
        {children}
       </UserStoreProvider>
    </QueryClientProvider>
  )
}