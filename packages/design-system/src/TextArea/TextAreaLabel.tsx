'use client'

import { useRef, useState } from 'react'
import { Label } from '../Label'
import { mergeCss } from '../utils'
import { TextArea, type TextAreaProps } from './TextArea'

export type TextAreaLabelProps = TextAreaProps & {
  name: string
  label: string
  isRequired: boolean
  error?: string
}
export const TextAreaLabel = ({
  name,
  label,
  isRequired,
  error,
  ...props
}: TextAreaLabelProps) => {
  const localRef = useRef<HTMLTextAreaElement>(null)
  const ref = props.ref ?? localRef
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      {isRequired ? (
        <span className="absolute -left-3 text-red-900">*</span>
      ) : null}
      <TextArea
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
            'transform origin-left scale-x-105 scale-y-110': isHovered,
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
            'text-xs -top-1.5 text-text': isFocused || props.value,
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
