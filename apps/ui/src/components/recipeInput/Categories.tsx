'use client'

import { useAiControllerCategoriesV1 } from '@repo/codegen/ai'
import {
  CuisineType,
  type DietaryType,
  DifficultyLevelType,
  DishType,
  MealType,
  ProteinType,
} from '@repo/codegen/model'
import {
  AsyncMultiSelect,
  MultiSelect,
  type OptionType,
  SelectLabel,
  TextButton,
} from '@repo/design-system'
import useTags from '@src/hooks/useTags'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { type ChangeEvent, useState } from 'react'
import type { GroupBase, MultiValue, OptionsOrGroups } from 'react-select'

const cuisineOptions: OptionType<CuisineType>[] = Object.keys(CuisineType).map(
  (k) => ({ value: k as CuisineType, label: k }),
)
const mealOptions: OptionType<MealType>[] = Object.keys(MealType).map((k) => ({
  value: k as MealType,
  label: k,
}))
const dishOptions: OptionType<DishType>[] = Object.keys(DishType).map((k) => ({
  value: k as DishType,
  label: k,
}))
const dietOptions: OptionType<DietaryType>[] = Object.keys(CuisineType).map(
  (k) => ({ value: k as DietaryType, label: k }),
)
const proteinOptions: OptionType<ProteinType>[] = Object.keys(ProteinType).map(
  (k) => ({ value: k as ProteinType, label: k }),
)
const difficultyOptions: OptionType<DifficultyLevelType>[] = Object.keys(
  DifficultyLevelType,
).map((k) => ({ value: k as DifficultyLevelType, label: k }))

export const Categories = () => {
  const { tags: fetchedTags, fetchTags } = useTags()
  const [options, setOptions] = useState<OptionType[]>([])
  const {
    difficultyLevel,
    setDifficultyLevel,
    cuisine,
    setCuisine,
    meal,
    setMeal,
    dish,
    setDish,
    diets,
    setDiets,
    proteins,
    setProteins,
    tags,
    setTags,
    makeGenerateCategoriesDto,
  } = useRecipeStore((state) => state)
  const { mutate } = useAiControllerCategoriesV1({
    mutation: { retry: false },
  })

  const handleDifficultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDifficultyLevel(
      event.target.value ? (event.target.value as DifficultyLevelType) : null,
    )
  }

  const handleCuisineChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCuisine(event.target.value ? (event.target.value as CuisineType) : null)
  }

  const handleMealChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setMeal(event.target.value ? (event.target.value as MealType) : null)
  }

  const handleDishChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDish(event.target.value ? (event.target.value as DishType) : null)
  }

  const handleDietsChange = (selected: MultiValue<OptionType>) => {
    setDiets((selected as typeof dietOptions).map((s) => s.value))
  }

  const handleProteinsChange = (selected: MultiValue<OptionType>) => {
    setProteins((selected as typeof proteinOptions).map((s) => s.value))
  }

  const handleTagsChange = (selected: MultiValue<OptionType>) => {
    setTags((selected as OptionType[]).map((s) => s.value))
  }

  const handleOnAutoGenerate = () => {
    mutate(
      { data: makeGenerateCategoriesDto() },
      {
        onSuccess: (data) => {
          setCuisine(data.cuisine)
          setMeal(data.meal)
          setDish(data.dish)
          setDiets(data.diets)
          setProteins(data.proteins)
          setDifficultyLevel(data.difficultyLevel)
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
      <h1 className="text-3xl font-bold mb-10">Categories</h1>
      <TextButton
        className="mb-5"
        text="auto generate categories"
        onClick={handleOnAutoGenerate}
      />
      <SelectLabel
        className="w-64"
        id="difficulty"
        label="difficulty"
        isRequired={false}
        value={difficultyLevel as string}
        options={difficultyOptions}
        onChange={handleDifficultyChange}
      />
      <SelectLabel
        className="w-64"
        id="cuisine"
        label="cuisine"
        isRequired={false}
        value={cuisine as string}
        options={cuisineOptions}
        onChange={handleCuisineChange}
      />
      <SelectLabel
        className="w-64"
        id="meal"
        label="meal"
        isRequired={false}
        value={meal as string}
        options={mealOptions}
        onChange={handleMealChange}
      />
      <SelectLabel
        className="w-64"
        id="dish"
        label="dish"
        isRequired={false}
        value={dish as string}
        options={dishOptions}
        onChange={handleDishChange}
      />
      <MultiSelect
        id="diets"
        label="diet(s)"
        className="w-64"
        options={dietOptions}
        value={diets.map((d) => ({ label: d, value: d }))}
        onChange={handleDietsChange}
      />
      <MultiSelect
        id="proteins"
        label="protien(s)"
        className="w-64"
        options={proteinOptions}
        value={proteins.map((p) => ({ label: p, value: p }))}
        onChange={handleProteinsChange}
      />
      <AsyncMultiSelect
        id="tags"
        label="tag(s)"
        className="w-64"
        options={options}
        value={tags.map((t) => ({ label: t, value: t }))}
        onChange={handleTagsChange}
        onLoadOptions={handleLoadOptions}
      />
    </section>
  )
}
