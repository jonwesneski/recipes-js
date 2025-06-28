'use client'

import { Navbar } from './Navbar'

export const NavigationLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <Navbar />
      </nav>

      <div className="flex-grow pt-10">{children}</div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
        <Navbar />
      </nav>
    </>
  )
}
