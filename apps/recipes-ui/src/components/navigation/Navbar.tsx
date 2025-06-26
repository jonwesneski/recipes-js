'use client'

import { useUserStore } from '@src/providers/use-store-provider'
import { useEffect, useState } from 'react'

export const Navbar = () => {
  const { useDarkMode } = useUserStore((state) => state)
  const [isOpen, setIsOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(useDarkMode)
  const [lightDarkString, setLightDarkString] = useState<'Light' | 'Dark'>(
    useDarkMode ? 'Light' : 'Dark',
  )

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : '',
    )
    setLightDarkString(() => (isDarkMode ? 'Light' : 'Dark'))
  }, [isDarkMode])

  const handleLightDarkMode = () => {
    setIsDarkMode((v) => !v)
  }

  return (
    <nav className="relative border-2">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setIsOpen((v) => !v)
          }}
        >
          NAVBAR
        </button>
        {isOpen && (
          <div className="absolute flex flex-col-reverse -translate-y-18 md:translate-y-5 md:flex-col border-2">
            <div onClick={handleLightDarkMode}>{lightDarkString} Mode</div>
            <div>Item 2</div>
            <div>Item 3</div>
          </div>
        )}
      </div>
    </nav>
  )
}
