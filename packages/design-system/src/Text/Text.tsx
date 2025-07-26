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
        'pl-2 border-0 border-b focus:outline-none',
        props.className,
      )}
      placeholder={placeHolder}
    />
  )
}
