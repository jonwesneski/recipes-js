import clsx from 'clsx'
import { type MouseEventHandler } from 'react'

interface SharedButtonProps {
  text: string
  variant: 'default' | 'opposite'
  onClick?: MouseEventHandler<HTMLButtonElement>
}
export const SharedButton = (props: SharedButtonProps) => {
  let background = '--background'
  let text = '--text'
  const { variant } = props
  switch (props.variant) {
    case 'opposite':
      background = '--text'
      text = '--background'
    default:
      background = '--background'
      text = '--text'
  }

  return (
    <button
      type="button"
      className={clsx('px-2 py-1 border-2 font-semibold hover:underline', {
        'bg-(--background)': variant === 'default',
        'text-(--text)': variant === 'default',
        'shadow-[4px_4px_theme(colors.text),4px_4px_0px_1px_theme(colors.background)]':
          variant === 'default',
        'bg-(--text)': variant === 'opposite',
        'text-(--background)': variant === 'opposite',
        'shadow-[4px_4px_theme(colors.background),4px_4px_0px_1px_theme(colors.text)]':
          variant === 'opposite',
      })}
      style={{ margin: '0 auto' }}
      onClick={props.onClick}
    >
      {`${props.text}.`}
    </button>
  )
}
