'use client'

import { useAiControllerTagsV1 } from '@repo/codegen/ai'
import { MultiSelect, type OptionType, TextButton } from '@repo/design-system'
import useTags from '@src/hooks/useTags'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useState } from 'react'
import type { GroupBase, MultiValue, OptionsOrGroups } from 'react-select'

export const Tags = () => {
  const { tags: fetchedTags, fetchTags } = useTags()
  const [options, setOptions] = useState<OptionType[]>([])
  const {
    tags,
    setTags,
    makeGenerateClassifiersDto: makeGenerateTagsDto,
  } = useRecipeStore((state) => state)
  const { mutate } = useAiControllerTagsV1({
    mutation: { retry: false },
  })

  const handleChange = (selected: MultiValue<OptionType>) => {
    setTags((selected as OptionType[]).map((s) => s.value))
  }

  const handleOnAutoGenerate = () => {
    mutate(
      { data: makeGenerateTagsDto() },
      {
        onSuccess: (data) => {
          setTags(data.tags)
          setOptions((value) => [
            ...data.tags.map((t) => ({ value: t, label: t })),
            ...value,
          ])
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

  return (
    <section>
      <h1 className="text-3xl font-bold mb-10">Tags</h1>
      <TextButton
        className="mb-5"
        text="auto generate tags"
        onClick={handleOnAutoGenerate}
      />
      <MultiSelect
        options={options}
        value={tags.map((t) => ({ label: t, value: t }))}
        onChange={handleChange}
        onLoadOptions={handleLoadOptions}
      />
    </section>
  )
}
