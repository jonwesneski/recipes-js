import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { mergeCss } from '../utils'

export type ButtonProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'style'
> & { variant?: 'default' | 'opposite'; text: string }
export const Button = ({ variant = 'default', ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      type={props.type ? props.type : 'button'}
      className={mergeCss(
        'px-2 py-1 border-2 font-semibold hover:underline',
        {
          'bg-(--background)': variant === 'default',
          'text-(--text)': variant === 'default',
          'shadow-[4px_4px_theme(colors.text),4px_4px_0px_1px_theme(colors.background)]':
            variant === 'default',
          'bg-(--text)': variant === 'opposite',
          'text-(--background)': variant === 'opposite',
          'shadow-[4px_4px_theme(colors.background),4px_4px_0px_1px_theme(colors.text)]':
            variant === 'opposite',
        },
        props.className,
      )}
    >
      {`${props.text}.`}
    </button>
  )
}
