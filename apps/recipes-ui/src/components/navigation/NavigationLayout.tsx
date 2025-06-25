'use client'
import { Navbar } from './Navbar'

export const NavigationLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      {/* Navbar for small screens (bottom fixed) */}
      <nav className="bottom-0 left-0 w-full md:hidden">
        <Navbar />
      </nav>

      {/* Navbar for medium screens and above (top fixed) */}
      <nav className="top-0 left-0 w-full hidden md:block">
        <Navbar />
      </nav>
      {children}
    </>
  )
}
