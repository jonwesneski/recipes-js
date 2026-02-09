'use client'

import { TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useEffect, useRef } from 'react'
import { IngredientsAmountDropdown } from './IngredientsAmountDropdown'
import { TimeTextLabel } from './TimeTextLabel'

export const BasicInfoInput = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const name = useRecipeStore((state) => state.name)
  const setName = useRecipeStore((state) => state.setName)
  const description = useRecipeStore((state) => state.description)
  const setDescription = useRecipeStore((state) => state.setDescription)
  const setCookingTimeInMinutes = useRecipeStore(
    (state) => state.setCookingTimeInMinutes,
  )
  const setPreparationTimeInMinutes = useRecipeStore(
    (state) => state.setPreparationTimeInMinutes,
  )
  const errors = useRecipeStore((state) => state.metadata.errors)

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [])

  const _convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':')
    return parseInt(hours) * 60 + parseInt(minutes)
  }

  return (
    <>
      <IngredientsAmountDropdown value="" onChange={(v) => console.log(v)} />
      <TextLabel
        className="w-5/6 md:max-w-3xl"
        ref={nameRef}
        name="recipe-name"
        value={name}
        error={errors.name}
        label="recipe name"
        isRequired
        onChange={(e) => setName(e.target.value)}
      />

      <TextLabel
        className="w-5/6 md:max-w-3xl"
        name="description"
        value={description ?? ''}
        label="short description"
        isRequired={false}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex gap-7">
        <TimeTextLabel
          name="prep-time"
          label="prep time"
          onChange={(time) =>
            setPreparationTimeInMinutes(_convertToMinutes(time))
          }
        />
        <TimeTextLabel
          name="cook-time"
          label="cook time"
          onChange={(time) => setCookingTimeInMinutes(_convertToMinutes(time))}
        />
      </div>
    </>
  )
}
