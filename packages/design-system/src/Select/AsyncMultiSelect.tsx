'use client'

import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { type ClassValue } from 'clsx'
import { useRef, useState } from 'react'
import type { GroupBase, MultiValue, OptionsOrGroups } from 'react-select'
import Select from 'react-select/async-creatable'
import { Label } from '../Label'
import { mergeCss } from '../utils'
import type { OptionType } from './types'

interface IAsyncMultiSelectProps {
  label: string
  id: string
  value: OptionType[]
  options: OptionType[]
  onChange: (_selected: MultiValue<OptionType>) => void
  onLoadOptions: (
    _inputValue: string,
  ) => Promise<OptionsOrGroups<OptionType, GroupBase<OptionType>>>
  className?: ClassValue
}
export const AsyncMultiSelect = (props: IAsyncMultiSelectProps) => {
  const ref = useRef<HTMLSelectElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const debouncedHandleLoadOptions = AwesomeDebouncePromise(
    props.onLoadOptions,
    500,
  )

  return (
    <div className="relative">
      <Select
        id={props.id}
        inputId={props.id}
        isMulti
        onChange={props.onChange}
        isClearable
        isSearchable
        cacheOptions
        placeholder=""
        defaultOptions={props.options}
        value={props.value}
        loadOptions={debouncedHandleLoadOptions}
        unstyled
        classNames={{
          container: () =>
            mergeCss(
              'border-2 hover:scale-105 focus:scale-105 [&_input:focus]:ring-0 focus:ring-offset-0 pb-1 pt-4',
              props.className,
            ),
          menu: () => 'border rounded-none shadow-lg mt-1',
          input: () => 'ml-1 cursor-text',
          multiValue: () => 'border border-dotted ml-1 mt-1',
          multiValueLabel: () => 'ml-1',
          multiValueRemove: () => 'text-gray-500 hover:text-gray-700 ml-1',
        }}
        menuPortalTarget={document.body}
      />
      <Label
        htmlFor={props.id}
        text={props.label}
        className={mergeCss(
          'absolute left-3 top-2 transition-all cursor-text text-text/35',
          {
            'text-xs top-0 text-text': isFocused || props.value.length > 0,
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
