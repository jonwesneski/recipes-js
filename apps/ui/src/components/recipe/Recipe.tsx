'use client'
import { Button, Label, Text, TextLabel } from '@repo/ui'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { isImageSizeUnderLimit } from '@src/utils/imageChecker'
import Image from 'next/image'
import { useState } from 'react'
import { RecipeCamera } from './RecipeCamera'
import { Steps } from './Steps'

interface RecipeProps {
  editEnabled: boolean
}
export const Recipe = (props: RecipeProps) => {
  const [showCamera, setShowCamera] = useState(false)
  const [addImageText, setAddImageText] = useState('add image')
  const [image, setImage] = useState<string | undefined>(undefined)
  const handleOnCamera = () => {
    setShowCamera(true)
  }

  const handleOnImage = (_image: string) => {
    if (isImageSizeUnderLimit(_image)) {
      setImage(_image)
      setAddImageText('replace image')
    }
    setShowCamera(false)
  }

  return (
    <RecipeStoreProvider initialState={{ editEnabled: props.editEnabled }}>
      <div className="flex flex-col gap-10">
        <TextLabel
          name="recipe"
          placeholder="Recipe name"
          label="recipe name"
        />

        <TextLabel
          name="description"
          placeholder="Short description"
          label="description"
        />
        <TextLabel
          name="prep-time"
          placeholder="30"
          label="prep. time"
          variant="none"
        />
        <TextLabel
          name="cook-time"
          placeholder="95"
          variant="none"
          label="cook time"
        />
        <Text name="cook-time" placeholder="95" variant="none" />
        <Label text="cook time in min." />
        <Button
          variant="opposite"
          text={addImageText}
          onClick={handleOnCamera}
        />
        {showCamera && <RecipeCamera onImage={handleOnImage} />}
        {image && <Image src={image} width={200} height={200} alt="taken" />}
      </div>
      <Steps />
    </RecipeStoreProvider>
  )
}
