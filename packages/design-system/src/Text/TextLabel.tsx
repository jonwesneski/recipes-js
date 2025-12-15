'use client'

import { useRef, useState } from 'react'
import { Label } from '../Label'
import { mergeCss } from '../utils'
import { Text, type TextProps } from './Text'

export type TextLabelProps = TextProps & {
  name: string
  label: string
  isRequired: boolean
  error?: string
}
export const TextLabel = ({
  name,
  label,
  isRequired,
  error,
  ...props
}: TextLabelProps) => {
  const localRef = useRef<HTMLInputElement>(null)
  const ref = props.ref ?? localRef
  const [isFocused, setIsFocused] = useState(false)
  const [isLabelHovered, setIsLabelHovered] = useState(false)

  return (
    <div className="relative bg-transparent flex flex-col">
      {isRequired ? (
        <span className="absolute -left-3 text-text-error">*</span>
      ) : null}
      <Text
        {...props}
        ref={ref}
        id={name}
        name={name}
        placeholder={isFocused && !props.value ? props.placeholder : undefined}
        data-error-for={name}
        onChange={props.onChange}
        onInput={props.onInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={mergeCss(
          {
            'transform origin-left scale-x-105 scale-y-105': isLabelHovered,
            'border-red-900': error,
          },
          props.className,
        )}
      />
      <Label
        htmlFor={name}
        text={label}
        className={mergeCss(
          'absolute left-3 top-2 transition-all cursor-text text-text/35',
          {
            'text-xs top-0 text-text': isFocused || props.value,
          },
        )}
        onClick={() => {
          setIsFocused(true)
          if (typeof ref !== 'function' && ref.current) {
            ref.current.focus()
          }
        }}
        onMouseEnter={() => setIsLabelHovered(true)}
        onMouseLeave={() => setIsLabelHovered(false)}
      />
      <Label
        htmlFor={name}
        text={error ?? ''}
        className="text-text-error block"
      />
    </div>
  )
}
