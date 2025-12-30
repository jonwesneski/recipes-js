'use client'

import { mergeCss } from '@repo/design-system'
import { useMediaQuery } from '@src/hooks'
import { useUserStore } from '@src/providers/use-store-provider'
import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'
import { Navbar } from './navigation'
import { SearchBar } from './SearchBar'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { width, breakpointPxs } = useMediaQuery()
  const pathname = usePathname()
  const { optimisticUiTheme } = useUserStore()

  useLayoutEffect(() => {
    const isDark =
      optimisticUiTheme === 'dark' ||
      (optimisticUiTheme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '')
  }, [optimisticUiTheme])

  // Don't show navbar on login page
  return pathname !== '/' ? (
    <>
      <nav className="fixed w-screen left-0 right-0 z-50 bottom-0 shadow-[0_-5px_15px_-5px] top-auto md:flex md:flex-col-reverse md:top-0 md:bottom-auto md:shadow-[0_5px_15px_-5px]">
        <SearchBar />
        <Navbar className="z-2" />
      </nav>

      <main
        className={mergeCss('pb-20 pt-20', {
          'pb-40': width < breakpointPxs.md,
          'pt-30': width >= breakpointPxs.md,
        })}
      >
        {children}
      </main>
    </>
  ) : (
    <main>{children}</main>
  )
}
