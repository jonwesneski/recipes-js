'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, type CameraType } from 'react-camera-pro'

interface RecipeCameraProps {
  onImage: (_image: string) => void
}
export const RecipeCamera = (props: RecipeCameraProps) => {
  const camera = useRef<CameraType>(null)
  const [scrollDisabled, setScrollDisabled] = useState<boolean>(true)

  const handleClick = () => {
    if (camera.current) {
      props.onImage(camera.current.takePhoto('base64url') as string)
      setScrollDisabled(false)
    }
  }

  useEffect(() => {
    if (scrollDisabled) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [scrollDisabled])

  return (
    <div className="fixed top-0 left-0 w-full h-full">
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
      <div className="fixed z-9 left-1/2 transform -translate-x-1/2 bottom-[80px] w-20 h-20 border-4 border-cream rounded-full bg-transparent">
        <div
          className="w-16 h-16 rounded-full bg-cream transform translate-x-1/17 translate-y-1/17"
          role="button"
          tabIndex={0}
          onClick={() => handleClick()}
          onKeyDown={() => handleClick()}
        />
      </div>
    </div>
  )
}
