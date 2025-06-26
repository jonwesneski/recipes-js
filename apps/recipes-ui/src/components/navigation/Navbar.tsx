'use client'

import { useEffect, useState } from 'react'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [ns, setNs] = useState([1, 2, 3])

  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : '',
    )
  }, [isDarkMode])

  return (
    <nav className="relative border-2">
      <button
        onClick={() => {
          //setIsOpen((v) => !v)
          setNs((v) => [...v, v.length + 1])
        }}
        onTouchCancel={() => {
          setIsDarkMode((value) => value)
          setIsOpen((v) => v)
        }}
      >
        NAVBAR
      </button>
      {isOpen && (
        <div className="absolute flex flex-col-reverse justify-end">
          {ns.map((n, index) => (
            <div key={index}>{n}</div>
          ))}
        </div>
      )}
    </nav>
  )
}
