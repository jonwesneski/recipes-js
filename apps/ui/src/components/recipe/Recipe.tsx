'use client'

import { TextLabel } from '@repo/ui'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { isImageSizeUnderLimit } from '@src/utils/imageChecker'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PhotoButtonsLabel } from './PhotoButtonsLabel'
import { RecipeCamera } from './RecipeCamera'
import { Steps } from './Steps'
import { TimeTextLabel } from './TimeTextLabel'

interface RecipeProps {
  editEnabled: boolean
}
export const Recipe = (props: RecipeProps) => {
  const nameRef = useRef<HTMLInputElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [image, setImage] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [])

  const handleOnCamera = () => {
    setShowCamera(true)
  }

  const handleOnImage = (_image: string) => {
    if (isImageSizeUnderLimit(_image)) {
      setImage(_image)
    }
    setShowCamera(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setImage(URL.createObjectURL(event.target.files[0]))
    }
  }

  return (
    <RecipeStoreProvider initialState={{ editEnabled: props.editEnabled }}>
      <div className="flex flex-col gap-10">
        <TextLabel
          ref={nameRef}
          name="recipe"
          placeholder="Recipe name"
          label="recipe name"
          isRequired
        />

        <TextLabel
          name="description"
          placeholder="Short description"
          label="description"
          isRequired={false}
        />

        <TimeTextLabel name="prep-time" label="prep time" />

        <TimeTextLabel name="cook-time" label="cook time" />

        <PhotoButtonsLabel
          onCameraClick={handleOnCamera}
          onUpload={handleFileChange}
        />

        {Boolean(showCamera) && <RecipeCamera onImage={handleOnImage} />}
        {image !== undefined && (
          <Image
            src={image}
            className="w-9/10 h-auto"
            width={0}
            height={0}
            alt="taken"
          />
        )}

        <Steps />
      </div>
    </RecipeStoreProvider>
  )
}
