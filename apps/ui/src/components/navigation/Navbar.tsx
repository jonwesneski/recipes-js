'use client'

import AddIcon from '@public/addIcon.svg'
import SearchIcon from '@public/searchIcon.svg'
import type {
  MeasurementFormat,
  NumberFormat,
  UiTheme,
} from '@repo/codegen/model'
import { RadioGroup } from '@repo/design-system'
import { ProfilePic } from '@src/components/ProfilePic'
import { useUserStore } from '@src/providers/use-store-provider'
import { type Svg } from '@src/types/svg'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type JSX, useEffect, useRef, useState } from 'react'
import { NavItem } from './NavItem'
import { NavLink } from './NavLink'

// Logic for determining which nav links to show based on route
type RouteKeys = 'list' | 'recipe' | 'edit' | 'create'
const regexRouteKeyMap = new Map<RegExp, RouteKeys>()
regexRouteKeyMap.set(/^\/recipes$/, 'list')
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
  list: [CreateRecipeLink],
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
    id,
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
          <ProfilePic
            className="mx-4 grow-0 cursor-pointer"
            imageUrl={imageUrl}
            handle="profile image"
          />
        </button>

        <div
          ref={menuRef}
          className={`absolute flex flex-col-reverse -z-1 -translate-y-[12rem] md:translate-y-5 md:flex-col border-2 transition-transform duration-300 ease-in ${isOpen ? 'scale-y-100' : 'scale-y-0'}`}
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
          {id ? (
            <NavItem>
              <div className="text-center">
                <Link href="/account">Account Settings</Link>
              </div>
            </NavItem>
          ) : null}
        </div>
      </div>
    </div>
  )
}
