'use client'

import { useUsersControllerUpdateUserV1 } from '@repo/codegen/users'
import { useUserStore } from '@src/providers/use-store-provider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const Navbar = () => {
  const { handle, useDarkMode } = useUserStore((state) => state)
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(useDarkMode)
  const [lightDarkString, setLightDarkString] = useState<'Light' | 'Dark'>(
    useDarkMode ? 'Light' : 'Dark',
  )
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const { mutate } = useUsersControllerUpdateUserV1()

  const renderNavItems = () => {
    switch (pathname) {
      case '/recipes':
        return (
          <>
            <Link href="/create-recipe">Add</Link>
          </>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : '',
    )
  }, [])

  const handleLightDarkMode = () => {
    setIsDarkMode((v) => {
      const newValue = !v

      document.documentElement.setAttribute(
        'data-theme',
        newValue ? 'dark' : '',
      )
      setLightDarkString(() => (newValue ? 'Light' : 'Dark'))
      mutate({
        handle,
        data: {
          useDarkMode: newValue,
        },
      })
      setIsOpen(false)

      return newValue
    })
  }

  const handleClick = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [isOpen])

  return (
    <div className="flex justify-between relative border-2">
      <div className="flex-1"></div>
      <div className="flex-2 mx-auto flex justify-center gap-3">
        {renderNavItems()}
      </div>
      <div className="flex-1 ml-auto flex justify-end">
        <button
          type="button"
          onClick={() => {
            setIsOpen((v) => !v)
          }}
        >
          NAVBAR
        </button>
        {isOpen ? (
          <div
            ref={menuRef}
            className="absolute flex flex-col-reverse -translate-y-18 md:translate-y-5 md:flex-col border-2"
          >
            <div
              onClick={handleLightDarkMode}
              role={'button'}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleLightDarkMode()
                }
              }}
            >
              {lightDarkString} Mode
            </div>
            <div>Item 2</div>
            <div>Item 3</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
