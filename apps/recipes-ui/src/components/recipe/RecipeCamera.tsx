'use client'

import { useRef } from 'react'
import { Camera, type CameraType } from 'react-camera-pro'

interface RecipeCameraProps {
  onImage: (_image: string) => void
}
export const RecipeCamera = (props: RecipeCameraProps) => {
  const camera = useRef<CameraType>(null)

  return (
    <div>
      <Camera
        ref={camera}
        facingMode="environment"
        errorMessages={{
          canvas: 'no canvas',
          noCameraAccessible: 'no camera access',
          permissionDenied: 'denied',
          switchCamera: 'switch failed',
        }}
      />
      <button
        type="button"
        className="fixed z-9 left-1/2 transform -translate-x-1/2 bottom-[80px]"
        onClick={() => {
          if (camera.current) {
            props.onImage(camera.current.takePhoto() as string)
          }
        }}
      >
        Take photo
      </button>
    </div>
  )
}
