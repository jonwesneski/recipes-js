'use client'

import { TextLabel } from '@repo/design-system'
import { useRecipesListStore } from '@src/providers/recipes-list-store-provider'
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

export const SearchBar = () => {
  const { aiFetchRecipes } = useRecipesListStore()
  const [input, setInput] = useState('')

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(event.currentTarget.value)
    }
  }
  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const searchValue = formData.get('search') as string
    handleSubmit(searchValue)
  }

  const handleSubmit = (value: string) => {
    aiFetchRecipes(value).catch((e: unknown) => console.error(e))
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setInput(event.target.value)
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <TextLabel
        className="w-full"
        name="search"
        label="search"
        value={input}
        isRequired={false}
        onChange={handleChange}
        enterKeyHint="go"
        onKeyDown={handleKeyDown}
      />
    </form>
  )
}
