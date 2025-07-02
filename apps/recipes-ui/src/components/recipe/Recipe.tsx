'use client'
import { Label, SharedButton, SharedInput } from '@repo/ui'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { isImageSizeUnderLimit } from '@src/utils/imageChecker'
import Image from 'next/image'
import { useState } from 'react'
import { RecipeCamera } from './RecipeCamera'

interface RecipeProps {
  editEnabled: boolean
}
export const Recipe = (props: RecipeProps) => {
  const [showCamera, setShowCamera] = useState(false)
  const [addImageText, setAddImageText] = useState('Add Image')
  const [image, setImage] = useState<string | undefined>(undefined)
  const handleOnCamera = () => {
    setShowCamera(true)
  }

  const handleOnImage = (_image: string) => {
    if (isImageSizeUnderLimit(_image)) {
      setImage(_image)
      setAddImageText('Replace Image')
    }
    setShowCamera(false)
  }

  return (
    <RecipeStoreProvider initialState={{ editEnabled: props.editEnabled }}>
      <div className="[&>*]:block mb-10">
        <SharedInput name="recipe" placeholder="Recipe name" />
        <Label text="recipe name" htmlFor="recipe" />
        <SharedInput name="description" placeholder="Short description" />
        <Label text="description" htmlFor="description" />
        <SharedInput name="prep-time" placeholder="30" variant="none" />
        <Label text="prep. time in min." htmlFor="prep-time" />
        <SharedInput name="cook-time" placeholder="95" variant="none" />
        <Label text="cook time in min." />
        <SharedButton text={addImageText} onClick={handleOnCamera} />
        {showCamera && <RecipeCamera onImage={handleOnImage} />}
        {image && <Image src={image} width={200} height={200} alt="Taken" />}
      </div>
      {/* <Steps /> */}
    </RecipeStoreProvider>
  )
}
