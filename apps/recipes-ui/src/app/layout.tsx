'use client'


import "@repo/design-system/styles.css"
import "@repo/ui/styles.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthenticationProvider } from '../providers/authentication-provider'
import "./globals.css"

// export const metadata: Metadata = {
//   title: 'React App',
//   description: 'Web site created with Next.js.',
// }

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="recipe-layout" style={{
             height: '100vh', // Or a specific height
             backgroundColor: '#ffffff',
             margin: '0px 20px'}}
         >
          <div id="root">
            <AuthenticationProvider>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </AuthenticationProvider>
          </div>
        </div>
      </body>
    </html>
  )
}
