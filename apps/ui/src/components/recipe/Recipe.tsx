'use client'

import { Button, Text } from '@repo/ui'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { isImageSizeUnderLimit } from '@src/utils/imageChecker'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { RecipeCamera } from './RecipeCamera'
import { Steps } from './Steps'
import { TimeTextLabel } from './TimeTextLabel'

interface RecipeProps {
  editEnabled: boolean
}
export const Recipe = (props: RecipeProps) => {
  const [showCamera, setShowCamera] = useState(false)
  const [addImageText, setAddImageText] = useState('take photo')
  const [uploadPhotoText, setUploadPhotoText] = useState('upload photo')
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | undefined>(undefined)
  const handleOnCamera = () => {
    setShowCamera(true)
  }

  const handleOnImage = (_image: string) => {
    if (isImageSizeUnderLimit(_image)) {
      setImage(_image)
      setAddImageText('replace photo')
      setUploadPhotoText('upload photo')
    }
    setShowCamera(false)
  }

  const handleOnUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click()
    }
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setImage(URL.createObjectURL(event.target.files[0]))
      setAddImageText('add photo')
      setUploadPhotoText('re-upload photo')
    }
  }

  return (
    <RecipeStoreProvider initialState={{ editEnabled: props.editEnabled }}>
      <div className="flex flex-col gap-10">
        <div>
          <Text
            className="border-0 w-full"
            name="recipe"
            placeholder="Recipe name"
          />
          <hr className="my-3 border-0 h-0.75 bg-text color-text" />
          <Text
            className="border-0 w-full"
            name="description"
            placeholder="Short description"
          />
        </div>
        {/* <TextLabel
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
        /> */}
        <TimeTextLabel name="prep-time" label="prep time" />
        <TimeTextLabel name="cook-time" label="cook time" />
        <div className="self-end flex gap-5">
          <Button
            variant="opposite"
            text={addImageText}
            onClick={handleOnCamera}
          />
          <Button
            variant="opposite"
            text={uploadPhotoText}
            onClick={handleOnUploadClick}
          />
          <input
            ref={uploadInputRef}
            className="hidden"
            type="file"
            accept="image/jpeg" //, image/png"
            onChange={handleFileChange}
          />
        </div>

        {Boolean(showCamera) && <RecipeCamera onImage={handleOnImage} />}
        {image !== undefined && (
          <Image src={image} width={200} height={200} alt="taken" />
        )}

        <Steps />
      </div>
    </RecipeStoreProvider>
  )
}
