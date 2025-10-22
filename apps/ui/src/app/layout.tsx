import '@repo/design-system/styles.css'
import Loading from '@src/components/LoadingComponent'
import { MainLayout } from '@src/components/MainLayout'
import { getAccessToken } from '@src/utils/getAccessToken'
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

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getAccessToken()

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
            <AppProviders token={token}>
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
