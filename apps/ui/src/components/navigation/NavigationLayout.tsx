'use client'

import { mergeCss } from '@repo/design-system'
import useMediaQuery from '@src/hooks/useMediaQuery'
import { usePathname } from 'next/navigation'
// import { useEffect, useRef, useState } from 'react'
import { Navbar } from './Navbar'

export const NavigationLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { width, breakpointPxs } = useMediaQuery()
  const pathname = usePathname()

  // const navRef = useRef<HTMLElement>(null)
  // const [navHeight, setNavHeight] = useState(0)

  // useEffect(() => {
  //   if (navRef.current) {
  //     setNavHeight(navRef.current.offsetHeight)
  //   }
  // }, [])

  return pathname !== '/' ? (
    <>
      <nav
        //ref={navRef}
        className={mergeCss('fixed w-screen left-0 right-0 z-50', {
          'bottom-0': width < breakpointPxs.md,
          'top-0': width >= breakpointPxs.md,
        })}
        // style={{
        //   bottom:
        //     width < breakpointPxs.md && navHeight
        //       ? `${navHeight}px`
        //       : undefined,
        // }}
      >
        <Navbar />
      </nav>

      <main className="pt-10 pb-20">{children}</main>
    </>
  ) : (
    children
  )
}
