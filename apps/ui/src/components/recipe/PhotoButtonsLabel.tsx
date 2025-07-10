'use client'

import { Button, UnderLabel } from '@repo/ui'
import {
  type ChangeEvent,
  type ChangeEventHandler,
  type MouseEventHandler,
  useRef,
  useState,
} from 'react'

interface PhotoButtonsLabelProps {
  onCameraClick: MouseEventHandler<HTMLButtonElement>
  onUpload: ChangeEventHandler<HTMLInputElement>
}
export const PhotoButtonsLabel = (props: PhotoButtonsLabelProps) => {
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [labelText, setLabelText] = useState<string>('photo')

  const handleOnUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click()
    }
  }

  const handleOnFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setLabelText('replace photo')
    props.onUpload(event)
  }

  return (
    <UnderLabel text={labelText} isRequired>
      <div className="flex flex-col">
        <div className="self-end flex gap-5 mb-3">
          <Button
            variant="opposite"
            text="camera"
            onClick={props.onCameraClick}
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
            onChange={handleOnFileUpload}
          />
        </div>
      </div>
    </UnderLabel>
  )
}
