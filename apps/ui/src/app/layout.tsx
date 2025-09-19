import '@repo/design-system/styles.css'
import Loading from '@src/components/LoadingComponent'
import { MainLayout } from '@src/components/MainLayout'
import { type Metadata, type Viewport } from 'next'
import AppProviders from './_providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Recipehall',
  description: 'A place to share recipes',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div
          className="md:mx-5"
          style={{
            height: '100vh',
          }}
        >
          <div id="root" className="px-2">
            <AppProviders>
              <Loading>
                <MainLayout>{children}</MainLayout>
              </Loading>
            </AppProviders>
          </div>
        </div>
      </body>
    </html>
  )
}
export default RootLayout
