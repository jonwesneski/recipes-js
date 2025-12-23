'use client'

import { mergeCss } from '@repo/design-system'
import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'
interface IToastProps {
  title: string
  message: string
  type: ToastType
  onClose: () => void
  onClick?: () => void
  duration: number
}
const Toast = (props: IToastProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const closeTimer = setTimeout(() => {
      props.onClose()
    }, props.duration)

    return () => clearTimeout(closeTimer)
  }, [props])

  return (
    <div
      className={mergeCss(
        'absolute top-4/5 md:top-1/5 -translate-y-1/2 left-1/2 mx-auto w-[85vw] bg-background border-2 border-text',
        { 'toast-enter': isVisible },
      )}
    >
      <div className="flex justify-end">
        <button
          type="button"
          className="relative px-2 py-1 font-semibold cursor-pointer overflow-hidden"
          onClick={props.onClose}
          style={
            {
              '--duration': `${props.duration}ms`,
            } as React.CSSProperties
          }
        >
          X{/* Progress-bar/border */}
          <span className="absolute top-0 left-0 h-[2px] w-0 bg-text animate-top-shrink" />
          <span className="absolute top-0 right-0 w-[2px] h-0 bg-text animate-right-shrink" />
          <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-text animate-bottom-shrink" />
          <span className="absolute bottom-0 left-0 w-[2px] h-0 bg-text animate-left-shrink" />
        </button>
      </div>
      <div
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={props.onClick}
        onKeyDown={props.onClick}
      >
        <h2 className="font-bold text-center">{props.title}</h2>
        <p className="text-center">{props.message}</p>
      </div>
    </div>
  )
}

export default Toast
