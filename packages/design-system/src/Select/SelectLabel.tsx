'use client'

import { type ClassValue } from 'clsx'
import {
  type ChangeEvent,
  type DetailedHTMLProps,
  type SelectHTMLAttributes,
  useRef,
  useState,
} from 'react'
import { Label } from '../Label'
import { mergeCss } from '../utils'

export type SelectLabelProps = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  label: string
  id: string
  className?: ClassValue
  options: { label: string; value: string }[]
}
export const SelectLabel = (props: SelectLabelProps) => {
  const ref = useRef<HTMLSelectElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(props.defaultValue !== '')

  function handleOnChange(event: ChangeEvent<HTMLSelectElement>): void {
    setHasValue(event.target.value !== '')
    props.onChange?.(event)
  }

  return (
    <div className="relative">
      <select
        ref={ref}
        className="px-2 py-2 align-text-bottom border-2 focus:border-[3px] focus:outline-none focus:transform focus:origin-left focus:scale-x-105 focus:scale-y-110"
        defaultValue={props.defaultValue}
        id={props.id}
        onChange={handleOnChange}
        onBlur={() => setIsFocused(false)}
      >
        {props.defaultValue !== undefined ? (
          <option value={props.defaultValue}>{props.defaultValue}</option>
        ) : null}

        {props.options.map((o) => {
          return (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          )
        })}
      </select>
      <Label
        htmlFor={props.id}
        text={props.label}
        className={mergeCss(
          'absolute left-3 top-2 transition-all cursor-text text-text/35',
          {
            'text-xs top-0 text-text': isFocused || hasValue,
          },
          'w-[216px]',
        )}
        onClick={() => {
          setIsFocused(true)
          ref.current?.showPicker()
        }}
      />
    </div>
  )
}
