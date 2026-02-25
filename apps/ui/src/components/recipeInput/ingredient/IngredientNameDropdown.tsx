'use client'

import { useAutocomplete } from '@src/hooks/useAutocomplete'
import { useDebouncedApi } from '@src/hooks/useDebouncedApi'
import { useEffect } from 'react'
import { useIngredientRow } from './IngredientRowProvider'

export const IngredientNameDropdown = () => {
  const { ingredient, onNameClick } = useIngredientRow()
  const { mutateAsync } = useAutocomplete()
  const { data: suggestions, setQuery } = useDebouncedApi({ mutateAsync })

  useEffect(() => {
    setQuery(ingredient.name.display.trim())
  }, [ingredient.name.display, setQuery])

  return (
    <div>
      <ul className="absolute w-full border">
        {suggestions?.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              className="w-full p-1.5 text-left cursor-pointer hover:bg-text hover:text-background"
              onClick={() => onNameClick(suggestion)}
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
