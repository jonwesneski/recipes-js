'use client'

import {
  useState,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from 'react'
import { mergeCss } from '../utils'

export type TextProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  variant?: 'ellipses' | 'none'
  ref?: React.RefObject<HTMLInputElement | null>
}
export const Text = ({
  variant = 'ellipses',
  type = 'text',
  ...props
}: TextProps) => {
  const placeHolder =
    variant === 'ellipses' && props.placeholder
      ? `${props.placeholder}...`
      : props.placeholder
  const [isHovered, setIsHovered] = useState(false)

  return (
    <input
      {...props}
      type={type}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={mergeCss(
        'px-2 py-2 align-text-bottom border-2 focus:border-[3px] focus:outline-none focus:transform focus:origin-left focus:scale-x-105 focus:scale-y-110',
        { 'transform origin-left scale-x-105 scale-y-110': isHovered },
        props.className,
      )}
      placeholder={placeHolder}
    />
  )
}
