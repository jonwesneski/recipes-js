'use client'

import type { MultiValue } from 'react-select'
import Select from 'react-select'
import { OptionType } from './types'

interface IMultiSelectProps {
  value: OptionType[]
  options: OptionType[]
  onChange: (_selected: MultiValue<OptionType>) => void
}
export const MultiSelect = (props: IMultiSelectProps) => {
  return (
    <Select
      isMulti
      onChange={props.onChange}
      isClearable
      isSearchable
      placeholder=""
      options={props.options}
      value={props.value}
      unstyled
      classNames={{
        container: () =>
          'border-2 hover:scale-105 focus:scale-105 [&_input:focus]:ring-0 focus:ring-offset-0 pb-1',
        menu: () => 'border rounded-none shadow-lg mt-1',
        input: () => 'ml-1 cursor-text',
        multiValue: () => 'border border-dotted ml-1 mt-1',
        multiValueLabel: () => 'ml-1',
        multiValueRemove: () => 'text-gray-500 hover:text-gray-700 ml-1',
      }}
    />
  )
}
