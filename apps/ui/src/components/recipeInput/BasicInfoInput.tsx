'use client'

import { TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useEffect, useRef } from 'react'
import { TimeTextLabel } from './TimeTextLabel'

export const BasicInfoInput = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const name = useRecipeStore((s) => s.name)
  const setName = useRecipeStore((s) => s.setName)
  const description = useRecipeStore((s) => s.description)
  const setDescription = useRecipeStore((s) => s.setDescription)
  const setCookingTimeInMinutes = useRecipeStore(
    (s) => s.setCookingTimeInMinutes,
  )
  const setPreparationTimeInMinutes = useRecipeStore(
    (s) => s.setPreparationTimeInMinutes,
  )
  const errors = useRecipeStore((s) => s.metadata.errors)

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [])
  console.log('aaaa')

  const _convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':')
    return parseInt(hours) * 60 + parseInt(minutes)
  }

  return (
    <>
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
