'use client'

import AddIcon from '@public/addIcon.svg'
import SearchIcon from '@public/searchIcon.svg'
import { useUsersControllerUpdateUserV1 } from '@repo/codegen/users'
import { useUserStore } from '@src/providers/use-store-provider'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { type JSX, useEffect, useRef, useState } from 'react'
import { NavLink } from './NavLink'

// I'm not sure if I want feed and search to be the same page.
// But right now they are
type RouteKeys = 'feed' | 'recipe' | 'edit' | 'create'
const regexRouteKeyMap = new Map<RegExp, RouteKeys>()
regexRouteKeyMap.set(/^\/recipes$/, 'feed')
regexRouteKeyMap.set(/^\/recipes\/\w+$/, 'recipe')
regexRouteKeyMap.set(/^\/recipes\/.+\/\w\/edit$/, 'edit')
regexRouteKeyMap.set(/^\/create-recipe$/, 'create')

const CreateRecipeLink = (
  <NavLink
    key="create"
    href="/create-recipe"
    icon={AddIcon as string}
    alt="create"
  />
)
const SearchRecipesLink = (
  <NavLink
    key="search"
    href="/recipes"
    icon={SearchIcon as string}
    alt="search"
  />
)
const routeKeyLinksMap: Record<RouteKeys | 'NONE', JSX.Element[] | null> = {
  recipe: [CreateRecipeLink, SearchRecipesLink],
  feed: [CreateRecipeLink],
  edit: [SearchRecipesLink],
  create: [SearchRecipesLink],
  NONE: null,
}

export const Navbar = () => {
  const { id, imageUrl, useDarkMode } = useUserStore((state) => state)
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(useDarkMode)
  const [lightDarkString, setLightDarkString] = useState<'Light' | 'Dark'>(
    useDarkMode ? 'Light' : 'Dark',
  )
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const { mutate } = useUsersControllerUpdateUserV1()

  const getRouteKey = () => {
    for (const [regex, value] of regexRouteKeyMap) {
      if (regex.test(pathname)) {
        return value
      }
    }
    return 'NONE'
  }

  const renderNavItems = () => {
    return routeKeyLinksMap[getRouteKey()]
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
        id,
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
      <div className="flex-1" />
      <div className="flex-2 mx-auto flex justify-center gap-3">
        {renderNavItems()}
      </div>
      <div className="flex-1 ml-auto flex justify-end">
        <button
          type="button"
          className="mr-3"
          onClick={() => {
            setIsOpen((v) => !v)
          }}
        >
          <Image
            src={
              imageUrl.length
                ? imageUrl
                : 'https://www.gravatar.com/avatar/?d=mp'
            }
            alt="profile image"
            width={30}
            height={30}
            className="mx-4 grow-0"
          />
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
