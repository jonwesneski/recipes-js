'use client'

import React from 'react'

interface INavItemProps {
  onClick?: () => void
  children: React.ReactNode
}
export const NavItem = (props: INavItemProps) => {
  return (
    <div
      onClick={props.onClick}
      role={'button'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          props.onClick?.()
        }
      }}
      className="cursor-pointer hover:border-l-2 hover:border-r-2 hover:scale-105 hover:shadow-[0px_1px_4px_theme(colors.text),0px_-1px_8px_theme(colors.text)]"
    >
      {props.children}
    </div>
  )
}
