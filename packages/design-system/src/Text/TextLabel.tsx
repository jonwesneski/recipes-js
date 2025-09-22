'use client'

import { useRef, useState } from 'react'
import { Label } from '../Label'
import { mergeCss } from '../utils'
import { Text, type TextProps } from './Text'

interface TextLabelProps {
  name: string
  placeholderLabel: string
  value?: string
  isRequired: boolean
  ref?: React.RefObject<HTMLInputElement | null>
  variant?: TextProps['variant']
  error?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}
export const TextLabel = (props: TextLabelProps) => {
  const localRef = useRef<HTMLInputElement>(null)
  const ref = props.ref ?? localRef
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      {props.isRequired ? (
        <span className="absolute -left-3 text-red-900">*</span>
      ) : null}
      <Text
        ref={ref}
        id={props.name}
        name={props.name}
        data-error-for={props.name}
        variant={props.variant}
        onChange={props.onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={mergeCss({
          'scale-110': isHovered,
          'border-red-900': props.error,
        })}
        value={props.value}
      />
      <Label
        htmlFor={props.name}
        text={props.placeholderLabel}
        className={mergeCss(
          'absolute left-3 top-2 transition-all cursor-text text-text/35',
          { 'text-xs top-0': isFocused || props.value },
        )}
        onClick={() => {
          setIsFocused(true)
          ref.current?.focus()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <Label
        htmlFor={props.name}
        text={props.error ?? ''}
        className="text-red-900 block"
        onClick={() => {
          setIsFocused(true)
          ref.current?.focus()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  )
}
