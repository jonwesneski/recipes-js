'use client'

import AddIcon from '@public/addIcon.svg'
import SearchIcon from '@public/searchIcon.svg'
import { useUserStore } from '@src/providers/use-store-provider'
import { type Svg } from '@src/types/svg'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { type JSX, useEffect, useRef, useState } from 'react'
import { NavItem } from './NavItem'
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
  <NavLink key="create" href="/create-recipe" svgIcon={AddIcon as Svg} />
)
const SearchRecipesLink = (
  <NavLink key="search" href="/recipes" svgIcon={SearchIcon as Svg} />
)
const routeKeyLinksMap: Record<RouteKeys | 'NONE', JSX.Element[] | null> = {
  recipe: [CreateRecipeLink, SearchRecipesLink],
  feed: [CreateRecipeLink],
  edit: [SearchRecipesLink],
  create: [SearchRecipesLink],
  NONE: null,
}

export const Navbar = () => {
  const { imageUrl, useDarkMode, setUseDarkMode } = useUserStore(
    (state) => state,
  )
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

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

  const handleLightDarkMode = async () => {
    await setUseDarkMode(!useDarkMode)
    setIsOpen(false)
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
            priority
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
            <NavItem
              onClick={() => void handleLightDarkMode()}
              text={`${useDarkMode ? 'Light' : 'Dark'} Mode`}
            />
            <div>Item 2</div>
            <div>Item 3</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
