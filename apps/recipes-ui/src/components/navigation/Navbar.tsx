'use client'

import { useUsersControllerUpdateUserV1 } from '@repo/recipes-codegen/users'
import { useUserStore } from '@src/providers/use-store-provider'
import { useEffect, useRef, useState } from 'react'

export const Navbar = () => {
  const { handle, useDarkMode } = useUserStore((state) => state)
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(useDarkMode)
  const [lightDarkString, setLightDarkString] = useState<'Light' | 'Dark'>(
    useDarkMode ? 'Light' : 'Dark',
  )
  const menuRef = useRef<HTMLDivElement>(null)

  const { mutate } = useUsersControllerUpdateUserV1()

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
    <nav className="relative border-2">
      <div className="flex justify-end">
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
    </nav>
  )
}
