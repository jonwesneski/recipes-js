'use client'

import '@repo/design-system/styles.css'
import { ModalRoot, ModalStoreProvider } from '@repo/ui'
import '@repo/ui/styles.css'
import { AuthenticationProvider } from '@src/providers/authentication-provider'
import { UserStoreProvider } from '@src/providers/use-store-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './globals.css'

// export const metadata: Metadata = {
//   title: 'React App',
//   description: 'Web site created with Next.js.',
// }

const queryClient = new QueryClient()

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div
          className="recipe-layout"
          style={{
            height: '100vh', // Or a specific height
            backgroundColor: '#ffffff',
            margin: '0px 20px',
          }}
        >
          <div id="root">
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
          </div>
        </div>
      </body>
    </html>
  )
}
export default RootLayout
