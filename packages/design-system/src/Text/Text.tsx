'use client'

import { useState } from 'react'
import { mergeCss } from '../utils'

export type TextProps = React.ComponentPropsWithRef<'input'> & {
  variant?: 'ellipses' | 'none'
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
        'px-2 py-2 align-text-bottom border-2 focus:border-[3px] focus:outline-none focus:origin-left focus:scale-x-105 focus:scale-y-110 transition-transform duration-300 ease-in-out transform',
        {
          'transform origin-left scale-x-105 scale-y-110 transition-transform duration-300 ease-in-out':
            isHovered,
        },
        props.className,
      )}
      placeholder={placeHolder}
    />
  )
}
