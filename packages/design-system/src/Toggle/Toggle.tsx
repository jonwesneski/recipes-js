import { type ClassValue } from 'clsx'
import { useState } from 'react'
import { mergeCss } from '../utils'

interface IToggleProps {
  onClick?: () => boolean
  onClickAsync?: () => Promise<boolean>
  initialIsOn?: boolean
  className?: ClassValue
}
export const Toggle = (props: IToggleProps) => {
  const [isOn, setIsOn] = useState(props.initialIsOn ?? false)

  const handleOnClick = async () => {
    if (props.onClick) {
      setIsOn(props.onClick())
    } else if (props.onClickAsync) {
      setIsOn(await props.onClickAsync())
    }
  }

  return (
    <button
      className={mergeCss(
        'w-11 h-5 flex items-center py-3 px-0.5 mt-1 duration-300 border-2 border-text',
        {
          'bg-background': !isOn,
          'bg-text text-background': isOn,
        },
        props.className,
      )}
      onClick={() => void handleOnClick()}
      aria-pressed={isOn}
    >
      {isOn ? 'on' : null}
      <span
        className={`bg-background w-2 h-6 border-2 border-text shadow-md transform transition-transform duration-500 ${
          isOn ? 'translate-x-2' : ''
        }`}
      ></span>
      {!isOn ? 'off' : null}
    </button>
  )
}
