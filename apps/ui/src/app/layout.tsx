import type { UserAccountResponse } from '@repo/codegen/model'
import { usersControllerUserAccountV1 } from '@repo/codegen/users'
import '@repo/design-system/styles.css'
import Loading from '@src/components/LoadingComponent'
import { MainLayout } from '@src/components/MainLayout'
import { type Metadata, type Viewport } from 'next'
import { cookies } from 'next/headers'
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
  let user: Partial<UserAccountResponse> = {}
  // Cookies are not automatically added in SSR from what I understand,
  // so doing it manually. Cookies will be empty with different domains however
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  const cookieHeader =
    typeof cookieStore.toString === 'function'
      ? cookieStore.toString()
      : cookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join('; ')
  if (token) {
    try {
      user = await usersControllerUserAccountV1({
        headers: {
          Authorization: `Bearer ${token}`,
          cookie: cookieHeader,
        },
      })
    } catch {
      // ignore
    }
  }
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
            <AppProviders initialState={{ ...user }}>
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
