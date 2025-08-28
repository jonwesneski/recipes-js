'use client'

interface INavItemProps {
  onClick?: () => void
  text: string
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
    >
      {props.text}
    </div>
  )
}
