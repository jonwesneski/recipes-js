'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type SetupWorker } from 'msw/browser'
import { useEffect, useState } from 'react'

const queryClient = new QueryClient()

const MSW_IGNORES = ['?_rsc=', '_next/', '__nextjs']

interface IInitProviderProps {
  children: React.ReactNode
}
const InitProvider = (props: IInitProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_MSW) {
      import('@src/mocks/mswBrowser')
        .then((mod: { worker: SetupWorker }) => {
          mod.worker
            .start({
              onUnhandledRequest(request, print) {
                if (MSW_IGNORES.some((i) => request.url.includes(i))) {
                  return
                }

                print.warning()
              },
            })
            .then(() => {
              setIsInitialized(true)
            })
            .catch((error: unknown) => {
              throw error
            })
        })
        .catch((error: unknown) => {
          console.error('Failed to start MSW server:', error)
        })
    } else {
      setIsInitialized(true)
    }
  }, [setIsInitialized])

  return isInitialized ? (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  ) : null
}
export default InitProvider
