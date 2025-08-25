'use client'

import { mergeCss } from '@repo/design-system'
import useMediaQuery from '@src/hooks/useMediaQuery'
import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export const NavigationLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { width, breakpointPxs } = useMediaQuery()
  const pathname = usePathname()

  return pathname !== '/' ? (
    <>
      <nav
        className={mergeCss('fixed w-screen left-0 right-0 z-50', {
          'bottom-0': width < breakpointPxs.md,
          'top-0': width >= breakpointPxs.md,
        })}
      >
        <Navbar />
      </nav>

      <main className="pt-10 pb-40">{children}</main>
    </>
  ) : (
    children
  )
}
