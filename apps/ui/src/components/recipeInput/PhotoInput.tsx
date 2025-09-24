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
  const [isFocused, setIsFocused] = useState(false)
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
    // <UnderLabel
    //   text={props.label}
    //   isRequired={props.isRequired}
    //   error={errorText}
    // >
    // <div className="flex flex-col">
    //   <div className="self-end flex gap-5 mb-3">
    //     <TextButton
    //       text="camera"
    //       onClick={() => void handleOnCameraClick()}
    //     />
    //     <TextButton text="upload" onClick={handleOnUploadClick} />
    //     <input
    //       ref={uploadInputRef}
    //       className="hidden"
    //       type="file"
    //       accept="image/jpeg" //, image/png"
    //       onChange={(event) => void handleOnFileUpload(event)}
    //     />
    //   </div>
    //   </div>
    // </UnderLabel>
    <div className="relative w-9/10 h-96 border mx-auto">
      <div className="flex flex-col justify-end h-full">
        {props.base64Src ? (
          <Image
            src={props.base64Src}
            className="w-full h-[85%] mx-auto object-contain"
            width={0}
            height={0}
            alt="main photo of recipe"
          />
        ) : null}
      </div>
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
      <div className="absolute right-2 top-4 flex self-end gap-2">
        <TextButton text="camera" onClick={() => void handleOnCameraClick()} />
        <TextButton text="upload" onClick={handleOnUploadClick} />
        <input
          ref={uploadInputRef}
          className="hidden"
          type="file"
          accept="image/jpeg" //, image/png"
          onChange={(event) => void handleOnFileUpload(event)}
        />
      </div>
      {props.base64Src ? (
        <TextButton
          className="absolute right-2 top-14"
          text="X"
          variant="opposite"
          onClick={() => props.onRemoveClick()}
        />
      ) : null}
    </div>
  )
}
