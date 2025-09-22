import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { mergeCss } from '../utils'

export type TextProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'style' | 'type'
> & { variant?: 'ellipses' | 'none' }
export const Text = ({ variant, ...props }: TextProps) => {
  const placeHolder =
    (variant === undefined || variant === 'ellipses') && props.placeholder
      ? `${props.placeholder}...`
      : props.placeholder

  return (
    <input
      {...props}
      type="text"
      className={mergeCss(
        'px-2 py-2 border focus:border-2 hover:scale-110 focus:outline-none',
        props.className,
      )}
      placeholder={placeHolder}
    />
  )
}
