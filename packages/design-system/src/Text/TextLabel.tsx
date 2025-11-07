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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative bg-transparent flex flex-col">
      {isRequired ? (
        <span className="absolute -left-3 text-red-900">*</span>
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
            'transform origin-left scale-x-105 scale-y-105': isHovered,
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
          ref.current?.focus()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <Label htmlFor={name} text={error ?? ''} className="text-red-900 block" />
    </div>
  )
}
