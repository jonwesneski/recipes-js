'use client'

import {
  useState,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from 'react'
import { mergeCss } from '../utils'

export type TextProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'type'
> & {
  variant?: 'ellipses' | 'none'
  ref?: React.RefObject<HTMLInputElement | null>
}
export const Text = ({ variant = 'ellipses', ...props }: TextProps) => {
  const placeHolder =
    variant === 'ellipses' && props.placeholder
      ? `${props.placeholder}...`
      : props.placeholder
  const [isHovered, setIsHovered] = useState(false)

  return (
    <input
      {...props}
      type="text"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={mergeCss(
        'px-2 py-2 align-text-bottom border focus:border-2 focus:outline-none',
        { 'scale-110': isHovered },
        props.className,
      )}
      placeholder={placeHolder}
    />
  )
}
