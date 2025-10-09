'use client'

import AddIcon from '@public/addIcon.svg'
import SearchIcon from '@public/searchIcon.svg'
import type {
  MeasurementFormat,
  NumberFormat,
  UiTheme,
} from '@repo/codegen/model'
import { RadioGroup } from '@repo/design-system'
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
  const {
    imageUrl,
    uiTheme,
    setUiTheme,
    measurementFormat,
    setMeasurementFormat,
    numberFormat,
    setNumberFormat,
  } = useUserStore((state) => state)
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

  const handleUiThemeChange = async (value: UiTheme) => {
    await setUiTheme(value)
    setIsOpen(false)
  }

  const handleMeasurementFormatChange = async (value: MeasurementFormat) => {
    await setMeasurementFormat(value)
    setIsOpen(false)
  }

  const handleNumberFormatChange = async (value: NumberFormat) => {
    await setNumberFormat(value)
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
              imageUrl?.length
                ? imageUrl
                : 'https://www.gravatar.com/avatar/?d=mp'
            }
            alt="profile image"
            priority
            width={30}
            height={30}
            className="mx-4 grow-0 cursor-pointer"
          />
        </button>

        <div
          ref={menuRef}
          className={`absolute flex flex-col-reverse -z-1 -translate-y-[10.5rem] md:translate-y-5 md:flex-col border-2 transition-transform duration-300 ease-in ${isOpen ? 'scale-y-100' : 'scale-y-0'}`}
          style={{ transformOrigin: 'bottom' }}
        >
          <NavItem>
            <h6 className="text-center">Theme</h6>
            <RadioGroup
              selectedValue={uiTheme}
              onChange={(value) => void handleUiThemeChange(value as UiTheme)}
              options={[
                { label: 'light', value: 'light' },
                { label: 'dark', value: 'dark' },
                { label: 'system', value: 'system' },
              ]}
            />
          </NavItem>
          <NavItem>
            <h6 className="text-center">Unit Format</h6>
            <RadioGroup
              selectedValue={measurementFormat}
              onChange={(value) =>
                void handleMeasurementFormatChange(value as MeasurementFormat)
              }
              options={[
                { label: 'default', value: 'default' },
                { label: 'imperial', value: 'imperial' },
                { label: 'metric', value: 'metric' },
              ]}
            />
          </NavItem>
          <NavItem>
            <h6 className="text-center">Number Format</h6>
            <RadioGroup
              selectedValue={numberFormat}
              onChange={(value) =>
                void handleNumberFormatChange(value as NumberFormat)
              }
              options={[
                { label: 'default', value: 'default' },
                { label: 'decimal', value: 'decimal' },
                { label: 'fraction', value: 'fraction' },
              ]}
            />
          </NavItem>
        </div>
      </div>
    </div>
  )
}
