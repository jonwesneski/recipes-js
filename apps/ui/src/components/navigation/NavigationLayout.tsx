'use client'

import { mergeCss } from '@repo/design-system'
import useMediaQuery from '@src/hooks/useMediaQuery'
import { Navbar } from './Navbar'

export const NavigationLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { width, breakpointPxs } = useMediaQuery()
  return (
    <>
      <nav
        className={mergeCss('fixed left-0 right-0 z-50', {
          'bottom-0': width <= breakpointPxs.sm,
          'top-0': width > breakpointPxs.sm,
        })}
      >
        <Navbar />
      </nav>

      <div className="flex-grow pt-10 pb-20">{children}</div>
    </>
  )
}
