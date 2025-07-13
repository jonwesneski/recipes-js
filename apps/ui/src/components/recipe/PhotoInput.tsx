'use client'

import { Button, UnderLabel } from '@repo/design-system'
import { useCamera } from '@src/providers/CameraProvider'
import { isImageSizeUnderLimit } from '@src/utils/imageChecker'
import { type ChangeEvent, useRef, useState } from 'react'

interface PhotoInputProps {
  label: string
  isRequired: boolean
  onCameraClick: (_value: string) => void
  onUploadClick: (_value: string) => void
}
export const PhotoInput = (props: PhotoInputProps) => {
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [errorText, setErrorText] = useState<string | undefined>()
  const { takePhoto } = useCamera()

  const handleOnCameraClick = async () => {
    try {
      const image = await takePhoto()
      props.onCameraClick(image)
    } catch (error) {
      setErrorText(error as string)
    }
  }

  const handleOnUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click()
    }
  }

  const handleOnFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      try {
        const image = await convertImageFileToBase64(event.target.files[0])
        if (isImageSizeUnderLimit(image)) {
          props.onUploadClick(image)
        } else {
          setErrorText('too big')
        }
      } catch (error) {
        setErrorText((error as Error).message)
      }
    }
  }

  const convertImageFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to Base64 string.'))
        }
      }

      reader.onerror = (error) => {
        console.log(error)
        reject(new Error('some error happened'))
      }

      reader.readAsDataURL(file)
    })
  }

  return (
    <UnderLabel
      text={props.label}
      isRequired={props.isRequired}
      error={errorText}
    >
      <div className="flex flex-col">
        <div className="self-end flex gap-5 mb-3">
          <Button
            variant="opposite"
            text="camera"
            onClick={() => void handleOnCameraClick()}
          />
          <Button
            variant="opposite"
            text="upload"
            onClick={handleOnUploadClick}
          />
          <input
            ref={uploadInputRef}
            className="hidden"
            type="file"
            accept="image/jpeg" //, image/png"
            onChange={(event) => void handleOnFileUpload(event)}
          />
        </div>
      </div>
    </UnderLabel>
  )
}
