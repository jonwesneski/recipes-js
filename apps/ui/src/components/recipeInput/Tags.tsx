'use client'

import { useAiControllerTagsV1 } from '@repo/codegen/ai'
import { TextButton } from '@repo/design-system'
import useTags from '@src/hooks/useTags'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { useEffect, useState } from 'react'
import { GroupBase, MultiValue, OptionsOrGroups } from 'react-select'
import Select from 'react-select/async-creatable'

type OptionType = { value: string; label: string }

export const Tags = () => {
  const { tags: fetchedTags, fetchTags } = useTags()
  const [options, setOptions] = useState<OptionType[]>([])
  const { tags, setTags, makeGenerateTagsDto } = useRecipeStore(
    (state) => state,
  )
  const { mutate } = useAiControllerTagsV1({
    mutation: { retry: false },
  })

  const handleChange = (selected: MultiValue<OptionType>) => {
    setTags((selected as OptionType[]).map((s) => s.value))
  }

  useEffect(() => {
    console.log({ tags })
  }, [tags])

  const handleOnAutoGenerate = () => {
    mutate(
      { data: makeGenerateTagsDto() },
      {
        onSuccess: (data) => {
          setTags(data)
        },
      },
    )
  }

  const handleLoadOptions = async (
    inputValue: string,
  ): Promise<OptionsOrGroups<OptionType, GroupBase<OptionType>>> => {
    await fetchTags(undefined, inputValue)
    const tagOptions = fetchedTags.map((f) => ({ value: f, label: f }))
    setOptions((value) => [...tagOptions, ...value])
    return tagOptions
  }
  const debouncedHandleLoadOptions = AwesomeDebouncePromise(
    handleLoadOptions,
    500,
  )

  return (
    <section>
      <h1 className="text-3xl font-bold mb-10">Tags</h1>
      <TextButton
        className="mb-5"
        text="auto generate tags"
        onClick={handleOnAutoGenerate}
      />
      <Select
        isMulti
        options={options}
        onChange={handleChange}
        placeholder="Select or type a new option..."
        isClearable
        isSearchable
        cacheOptions
        defaultOptions
        loadOptions={debouncedHandleLoadOptions}
      />
    </section>
  )
}
