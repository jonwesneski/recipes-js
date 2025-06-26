'use client'

import { Navbar } from './Navbar'

export const NavigationLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="hidden md:block">
        <Navbar />
      </header>

      <div className="flex-grow p-4">{children}</div>

      <footer className="md:hidden">
        <Navbar />
      </footer>
    </div>
  )
}
