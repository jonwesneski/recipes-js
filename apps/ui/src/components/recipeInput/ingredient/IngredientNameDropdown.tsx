'use client'

import { useAutocomplete } from '@src/hooks/useAutocomplete'
import { useDebouncedApi } from '@src/hooks/useDebouncedApi'
import { useEffect } from 'react'

interface IngredientNameDropdownProps {
  value: string
  onClick: (_value: string) => void
}

export const IngredientNameDropdown = (props: IngredientNameDropdownProps) => {
  const { mutateAsync } = useAutocomplete()
  const { data: suggestions, setQuery } = useDebouncedApi({ mutateAsync })

  useEffect(() => {
    setQuery(props.value)
  }, [props.value, setQuery])

  return (
    <div>
      <ul className="absolute p-1.5 w-full border">
        {suggestions?.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              className="w-full text-left cursor-pointer hover:bg-text hover:text-background"
              onClick={() => props.onClick(suggestion)}
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
