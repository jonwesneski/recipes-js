'use client'

import { Label, mergeCss } from '@repo/design-system'
import { useRecipesListStore } from '@src/providers/recipes-list-store-provider'
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

export const SearchBar = () => {
  const ref = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
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
    <form
      className="relative bg-transparent flex flex-col"
      onSubmit={handleOnSubmit}
    >
      <input
        type="text"
        className="px-2 py-2 align-text-bottom border-2 focus:border-[3px] focus:outline-none"
        ref={ref}
        id="search"
        name="search"
        onChange={handleChange}
        enterKeyHint="go"
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Label
        htmlFor="search"
        text="search"
        className={mergeCss(
          'absolute left-3 top-2 transition-all cursor-text text-text/35',
          {
            'text-xs top-0 text-text': isFocused || input,
          },
        )}
        onClick={() => {
          setIsFocused(true)
          ref.current?.focus()
        }}
      />
    </form>
  )
}
