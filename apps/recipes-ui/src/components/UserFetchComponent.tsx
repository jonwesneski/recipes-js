'use client'

import { UserStoreProvider } from '@src/providers/use-store-provider'
import { Suspense } from 'react'

export const UserFetchComponent = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Suspense fallback={<div>...loading</div>}>
      <UserStoreProvider>{children}</UserStoreProvider>
    </Suspense>
  )
}
