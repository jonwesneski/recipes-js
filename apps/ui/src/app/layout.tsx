import type { UserAccountResponse } from '@repo/codegen/model'
import { usersControllerUserAccountV1 } from '@repo/codegen/users'
import '@repo/design-system/styles.css'
import Loading from '@src/components/LoadingComponent'
import { MainLayout } from '@src/components/MainLayout'
import { getAccessToken } from '@src/utils/getAccessToken'
import { type Metadata, type Viewport } from 'next'
import { Suspense } from 'react'
import AppProviders from './_providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'recipehall.',
  applicationName: 'recipehall',
  description: 'A place to share recipes',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  /**
   * Since I am free plan, I am just cancelling request after short time
   * to try again with a suspense.
   *  - I don't want to start with suspense because I want to try to get
   *    the theme first and only to show loading message if provisioning
   */
  let assumeServiceIsProvisioning = false
  const token = await getAccessToken()
  let user: UserAccountResponse = {} as UserAccountResponse
  // If AbortSignal.timeout(2000) doesn't work try below
  // const timeoutPromise = new Promise((_, reject) =>
  //   setTimeout(() => reject(new Error('Timeout')), 2000),
  // )

  // try {
  //   // Promise.race returns as soon as the FIRST promise settles
  //   user = await Promise.race([
  //     usersControllerUserAccountV1({
  //       headers: { Authorization: `Bearer ${token}` },
  //     }),
  //     timeoutPromise,
  //   ])
  // } catch (err) {
  //   // If the timeoutPromise rejects first, we land here
  //   assumeServiceIsProvisioning = true
  // }
  if (token) {
    try {
      user = await usersControllerUserAccountV1(
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        AbortSignal.timeout(2000),
      )
    } catch {
      assumeServiceIsProvisioning = true
    }
  }

  return (
    <html lang="en" data-theme={user.uiTheme === 'dark' ? 'dark' : ''}>
      <body>
        <div
          className="md:mx-5"
          style={{
            height: '100vh',
          }}
        >
          <div id="root" className="px-2">
            {!assumeServiceIsProvisioning ? (
              <Layout>{children}</Layout>
            ) : (
              <Suspense fallback={<Loading />}>
                <Layout>{children}</Layout>
              </Suspense>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}

export default RootLayout

const Layout = async ({ children }: { children: React.ReactNode }) => {
  let user: UserAccountResponse = {} as UserAccountResponse
  // Cookies are not automatically added in SSR from what I understand,
  // so doing it manually. Cookies will be empty with different domains however
  const token = await getAccessToken()
  if (token) {
    try {
      user = await usersControllerUserAccountV1({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch {
      // ignore
    }
  }

  return (
    <AppProviders initialState={{ ...user }}>
      <MainLayout>{children}</MainLayout>
    </AppProviders>
  )
}
