import '@repo/design-system/styles.css'
import { type Metadata } from 'next'
import AppProviders from './_providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div
          className="px-2 md:mx-5"
          style={{
            height: '100vh',
          }}
        >
          <div id="root">
            <AppProviders>{children}</AppProviders>
          </div>
        </div>
      </body>
    </html>
  )
}
export default RootLayout
