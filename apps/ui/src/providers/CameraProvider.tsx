'use client'

import { RecipeCamera } from '@src/components/recipeInput/RecipeCamera'
import { isImageSizeUnderLimit } from '@src/utils/imageChecker'
import { createContext, useContext, useState, type ReactNode } from 'react'

type CallbackType = (_value: string) => void
export type CameraType = {
  takePhoto: () => Promise<string>
}
export const CameraContext = createContext<CameraType | null>(null)

export interface CameraProviderProps {
  children: ReactNode
}
export const CameraProvider = ({ children }: CameraProviderProps) => {
  const [onImage, setOnImage] = useState<CallbackType>(() => undefined)
  const [onError, setOnError] = useState<CallbackType>(() => undefined)
  const [showCamera, setShowCamera] = useState(false)

  const handleOnImage = (_image: string) => {
    if (isImageSizeUnderLimit(_image)) {
      onImage(_image)
    } else {
      onError('photo too big')
    }
    setShowCamera(false)
  }

  const takePhoto = (): Promise<string> => {
    const { promise, resolve, reject } = Promise.withResolvers<string>()
    setOnImage(() => resolve)
    setOnError(() => reject)
    setShowCamera(true)
    return promise
  }

  return (
    <CameraContext.Provider value={{ takePhoto }}>
      {children}
      {showCamera ? <RecipeCamera onImage={handleOnImage} /> : null}
    </CameraContext.Provider>
  )
}

export const useCamera = () => {
  const context = useContext(CameraContext)
  if (!context) {
    throw new Error(
      `${useCamera.name} must be used within a ${CameraProvider.name}`,
    )
  }
  return context
}
