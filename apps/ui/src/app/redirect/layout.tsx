import { Suspense } from 'react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense>{children}</Suspense>
}
export default RootLayout
