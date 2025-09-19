'use client'

import { type ClassValue } from 'clsx'
import { mergeCss } from '../utils'

interface IRadioGroupProps {
  className?: ClassValue
  options: { label: string; value: string }[]
  selectedValue: string
  onChange: (_value: string) => void
}
export const RadioGroup = (props: IRadioGroupProps) => {
  const handleOnChange = (value: string) => {
    props.onChange(value)
  }

  return (
    <div className="flex divide-x divide-text">
      {props.options.map((option) => {
        return (
          <button
            key={option.value}
            type="button"
            className={mergeCss(
              'p-1',
              {
                'bg-text text-background': option.value === props.selectedValue,
                'hover:bg-(--text) hover:text-(--background) cursor-pointer':
                  option.value !== props.selectedValue,
              },
              props.className,
            )}
            onClick={() => handleOnChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
