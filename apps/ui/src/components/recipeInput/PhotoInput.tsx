'use client'

import { Label, mergeCss, TextButton } from '@repo/design-system'
import { useCamera } from '@src/providers/CameraProvider'
import { isImageSizeUnderLimit } from '@src/utils/imageChecker'
import Image from 'next/image'
import { type ChangeEvent, useRef, useState } from 'react'

interface PhotoInputProps {
  id: string
  label: string
  isRequired: boolean
  base64Src: string | null
  onCameraClick: (_value: string) => void
  onUploadClick: (_value: string) => void
  onRemoveClick: () => void
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
    <div
      className={mergeCss('relative w-full h-96 border-2 mx-auto', {
        'border-red-900': errorText,
      })}
    >
      {props.base64Src ? (
        <div className="flex flex-col justify-end h-full">
          <Image
            src={props.base64Src}
            className="w-full h-[85%] mx-auto object-contain"
            width={0}
            height={0}
            alt="main photo of recipe"
          />
        </div>
      ) : null}
      {errorText ? (
        <p className="absolute left-2 top-12 text-red-900">{errorText}</p>
      ) : null}

      <Label
        htmlFor={props.id}
        text={props.label}
        className={mergeCss(
          'absolute left-3 top-2 transition-all cursor-text text-text/35',
          {
            'text-xs top-0 text-text': props.base64Src,
          },
        )}
      />
      <div className="absolute right-2 top-1 flex self-end gap-2">
        <TextButton
          className="px-0.5"
          text="camera"
          onClick={() => void handleOnCameraClick()}
        />
        <TextButton
          className="px-0.5"
          text="upload"
          onClick={handleOnUploadClick}
        />
        <input
          ref={uploadInputRef}
          id={props.id}
          className="hidden"
          type="file"
          accept="image/jpeg" //, image/png"
          onChange={(event) => void handleOnFileUpload(event)}
        />
      </div>
      {props.base64Src ? (
        <TextButton
          className="absolute right-2 top-12"
          text="X"
          variant="opposite"
          onClick={() => props.onRemoveClick()}
        />
      ) : null}
    </div>
  )
}
