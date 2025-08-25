import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import { mergeCss } from '../utils'

export type ButtonProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'style'
> & { variant?: 'default' | 'opposite'; children: ReactNode }
export const Button = ({
  type = 'button',
  variant = 'default',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={mergeCss(
        'px-2 py-1 border-2 font-semibold hover:underline cursor-pointer',
        {
          'bg-(--text)': variant === 'default',
          'text-(--background)': variant === 'default',
          'shadow-[4px_4px_theme(colors.background),4px_4px_0px_1px_theme(colors.text)]':
            variant === 'default',
          'bg-(--background)': variant === 'opposite',
          'text-(--text)': variant === 'opposite',
          'shadow-[4px_4px_theme(colors.text),4px_4px_0px_1px_theme(colors.background)]':
            variant === 'opposite',
        },
        props.className,
      )}
    >
      {props.children}
    </button>
  )
}
