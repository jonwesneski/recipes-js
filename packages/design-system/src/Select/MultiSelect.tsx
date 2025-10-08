'use client'

import AwesomeDebouncePromise from 'awesome-debounce-promise'
import type { GroupBase, MultiValue, OptionsOrGroups } from 'react-select'
import Select from 'react-select/async-creatable'

export type OptionType = { value: string; label: string }

interface IMultiSelectProps {
  options: OptionType[]
  onChange: (_selected: MultiValue<OptionType>) => void
  onLoadOptions: (
    _inputValue: string,
  ) => Promise<OptionsOrGroups<OptionType, GroupBase<OptionType>>>
}
export const MultiSelect = (props: IMultiSelectProps) => {
  const debouncedHandleLoadOptions = AwesomeDebouncePromise(
    props.onLoadOptions,
    500,
  )

  return (
    <Select
      isMulti
      onChange={props.onChange}
      isClearable
      isSearchable
      cacheOptions
      placeholder=""
      defaultOptions={props.options}
      loadOptions={debouncedHandleLoadOptions}
      unstyled
      classNames={{
        container: () =>
          'border-2 hover:scale-105 focus:scale-105 [&_input:focus]:ring-0 focus:ring-offset-0 pb-1',
        menu: () => 'border rounded-none shadow-lg mt-1',
        input: () => 'ml-1',
        multiValue: () => 'border border-dotted ml-1 mt-1',
        multiValueLabel: () => 'ml-1',
        multiValueRemove: () => 'text-gray-500 hover:text-gray-700 ml-1',
      }}
    />
  )
}
