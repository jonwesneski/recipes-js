import { ClassValue } from 'clsx'
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
        'w-14 h-5 flex items-center rounded-full py-3 px-0.5 mt-1 duration-300 border border-text',
        {
          'bg-background': !isOn,
          'bg-text': isOn,
        },
        props.className,
      )}
      onClick={() => void handleOnClick()}
      aria-pressed={isOn}
    >
      <span
        className={`bg-background w-5 h-5 rounded-full border border-text shadow-md transform duration-300 ${
          isOn ? 'translate-x-8' : ''
        }`}
      ></span>
    </button>
  )
}
