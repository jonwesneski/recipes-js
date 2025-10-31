'use client'

import { TextLabel } from '@repo/design-system'
import { useRecipesListStore } from '@src/providers/recipes-list-store-provider'
import { FormEvent, type KeyboardEvent } from 'react'

export const SearchBar = () => {
  const { aiFetchRecipes } = useRecipesListStore()

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(event.currentTarget.value)
    }
  }
  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const searchValue = formData.get('search')?.toString() ?? ''
    handleSubmit(searchValue)
  }

  const handleSubmit = (input: string) => {
    aiFetchRecipes(input).catch((e) => console.error(e))
  }

  return (
    <form onSubmit={(e) => void handleOnSubmit(e)}>
      <TextLabel
        name="search"
        label="search"
        isRequired={false}
        enterKeyHint="go"
        onKeyDown={handleKeyDown}
      />
    </form>
  )
}
