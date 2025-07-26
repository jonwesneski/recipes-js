'use client'

import { tagsControllerTagNameListV1 } from '@repo/codegen/tags'
import { TextLabel } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PhotoInput } from './PhotoInput'
import { Steps } from './Steps'
import { TimeTextLabel } from './TimeTextLabel'

export const Recipe = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const {
    setName,
    setDescription,
    setCookingTimeInMinutes,
    setPreparationTimeInMinutes,
    setImage,
    base64Image,
  } = useRecipeStore((state) => state)

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [])

  const [_tags, setTags] = useState<string[]>([])
  useEffect(() => {
    // todo add params
    const fetchTags = async (nextCursor?: number) => {
      const currentTags = await tagsControllerTagNameListV1({
        params: { cursorId: nextCursor },
      })
      setTags((tags) => [...tags, ...currentTags.data])
      if (currentTags.pagination.nextCursor !== null) {
        await fetchTags(currentTags.pagination.nextCursor)
      }
    }

    fetchTags().catch((e: unknown) => console.log(e))
  }, [])

  const handleOnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleOnDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDescription(event.target.value)
  }

  const handleOnPrepChange = (time: string) => {
    setPreparationTimeInMinutes(_convertToMinutes(time))
  }

  const handleOnCookChange = (time: string) => {
    setCookingTimeInMinutes(_convertToMinutes(time))
  }

  const _convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':')
    return parseInt(hours) * 60 + parseInt(minutes)
  }

  const handleOnCameraClick = (image: string) => {
    setImage(image)
  }

  const handleOnUploadClick = (image: string) => {
    setImage(image)
  }

  return (
    <div className="flex flex-col gap-10">
      <TextLabel
        ref={nameRef}
        name="recipe"
        placeholder="Recipe name"
        label="recipe name"
        isRequired
        onChange={handleOnNameChange}
      />

      <TextLabel
        name="description"
        placeholder="Short description"
        label="description"
        isRequired={false}
        onChange={handleOnDescriptionChange}
      />

      <div className="flex">
        <TimeTextLabel
          name="prep-time"
          label="prep time"
          onChange={handleOnPrepChange}
        />
        <TimeTextLabel
          name="cook-time"
          label="cook time"
          onChange={handleOnCookChange}
        />
      </div>

      <PhotoInput
        label="recipe photo"
        isRequired
        onCameraClick={handleOnCameraClick}
        onUploadClick={handleOnUploadClick}
      />

      {base64Image ? (
        <Image
          src={base64Image}
          className="w-9/10 h-auto mx-auto"
          width={0}
          height={0}
          alt="taken"
        />
      ) : null}
      <hr className="h-1 bg-text border-none" />
      <Steps />
      <hr className="h-1 bg-text border-none" />
    </div>
  )
}
