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
        'px-2 py-1 border-2 font-semibold hover:underline cursor-pointer hover:scale-110',
        {
          'bg-(--text)': variant === 'default',
          'text-(--background)': variant === 'default',
          'custom-shadow-default': variant === 'default',
          'bg-(--background)': variant === 'opposite',
          'text-(--text)': variant === 'opposite',
          'custom-shadow-opposite': variant === 'opposite',
        },
        props.className,
      )}
    >
      {props.children}
    </button>
  )
}
