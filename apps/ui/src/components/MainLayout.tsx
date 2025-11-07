'use client'

import { mergeCss } from '@repo/design-system'
import useMediaQuery from '@src/hooks/useMediaQuery'
import { useUserStore } from '@src/providers/use-store-provider'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Navbar } from './navigation'
import { SearchBar } from './SearchBar'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { width, breakpointPxs } = useMediaQuery()
  const pathname = usePathname()
  const uiTheme = useUserStore((state) => state.uiTheme)

  useEffect(() => {
    const isDark =
      uiTheme === 'dark' ||
      (uiTheme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '')
  }, [uiTheme])

  // Don't show navbar on login page
  return pathname !== '/' ? (
    <>
      <nav
        className={mergeCss(
          'fixed w-screen left-0 right-0 z-50 flex flex-col-reverse md:flex-col',
          {
            'bottom-0': width < breakpointPxs.md,
            'top-0': width >= breakpointPxs.md,
          },
        )}
      >
        <Navbar className="z-2" />
        <SearchBar />
      </nav>

      <main className="pt-10 pb-40">{children}</main>
    </>
  ) : (
    <>{children}</>
  )
}
