'use client'

import AddIcon from '@public/addIcon.svg'
import SearchIcon from '@public/searchIcon.svg'
import type {
  MeasurementFormat,
  NumberFormat,
  UiTheme,
} from '@repo/codegen/model'
import { type ClassValue, mergeCss, RadioGroup } from '@repo/design-system'
import { ProfilePic } from '@src/components/ProfilePic'
import useMediaQuery from '@src/hooks/useMediaQuery'
import { useUserStore } from '@src/providers/use-store-provider'
import { type Svg } from '@src/types/svg'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type JSX, useEffect, useRef, useState } from 'react'
import { NavItem } from './NavItem'
import { NavLink } from './NavLink'

// Logic for determining which nav links to show based on route
type RouteKeys = 'list' | 'recipe' | 'edit' | 'create' | 'user'
const regexRouteKeyMap = new Map<RegExp, RouteKeys>()
regexRouteKeyMap.set(/^\/recipes$/, 'list')
regexRouteKeyMap.set(/^\/recipes\/\w+$/, 'recipe')
regexRouteKeyMap.set(/^\/recipes\/.+\/\w\/edit$/, 'edit')
regexRouteKeyMap.set(/^\/create-recipe$/, 'create')
regexRouteKeyMap.set(/^\/users\/\w+$/, 'user')
regexRouteKeyMap.set(/^\/account$/, 'user')

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
  user: [SearchRecipesLink],
  NONE: null,
}

interface INavbarProps {
  className?: ClassValue
}
export const Navbar = (props: INavbarProps) => {
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleMenuRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const { width, breakpointPxs } = useMediaQuery()

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
    setIsMenuOpen(false)
  }

  const handleMeasurementFormatChange = async (value: MeasurementFormat) => {
    await setMeasurementFormat(value)
    setIsMenuOpen(false)
  }

  const handleNumberFormatChange = async (value: NumberFormat) => {
    await setNumberFormat(value)
    setIsMenuOpen(false)
  }

  const handleClick = (e: MouseEvent) => {
    const target = e.target as Node
    const clickedOutsideMenu =
      menuRef.current && !menuRef.current.contains(target)
    const clickedOutsideButton =
      toggleMenuRef.current && !toggleMenuRef.current.contains(target)

    if (clickedOutsideMenu && clickedOutsideButton) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('pointerdown', handleClick)
    }
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [isMenuOpen])

  return (
    <div
      className={mergeCss(
        'flex justify-between relative border-2',
        props.className,
      )}
    >
      <div className="flex-1" />
      <div className="flex-2 mx-auto flex justify-center gap-3">
        {renderNavItems()}
      </div>
      <div className="flex-1 ml-auto flex justify-end">
        <button
          ref={toggleMenuRef}
          type="button"
          className="mr-3"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <ProfilePic
            className="mx-4 grow-0 cursor-pointer"
            imageUrl={imageUrl}
            handle="profile image"
          />
        </button>

        <div
          ref={menuRef}
          className={mergeCss(
            `absolute flex flex-col-reverse -z-1 md:translate-y-6 md:flex-col border-2 transition-transform duration-300 ease-in`,
            {
              'scale-y-100': isMenuOpen,
              'scale-y-0': !isMenuOpen,
              // Update -translate-y-* anytime you add a new NavItem to the dropdown
              '-translate-y-[12rem]': !id,
              '-translate-y-[13.5rem]': id,
            },
          )}
          style={{
            transformOrigin: width < breakpointPxs.md ? 'bottom' : 'top',
          }}
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
          <NavItem>
            <div className="text-center">
              <Link href="/">{id ? 'Logout' : 'Login'}</Link>
            </div>
          </NavItem>
        </div>
      </div>
    </div>
  )
}
