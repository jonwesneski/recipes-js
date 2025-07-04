import {
  useState,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from 'react'

export type TimeTextLabelProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'style' | 'className' | 'type'
> & { label: string }
export const TimeTextLabel = (props: TimeTextLabelProps) => {
  const placeholder = '00:00'
  const [time, setTime] = useState('')

  const handleOnInput = (event: React.InputEvent<HTMLInputElement>) => {
    if (event.nativeEvent.inputType === 'insertText') {
      setTime((t) => {
        const digitString =
          `${t.replace(':', '').replaceAll('0', '')}${event.nativeEvent.data}`.padStart(
            4,
            '0',
          )
        if (digitString.length <= 4) {
          return `${digitString.slice(0, 2)}:${digitString.slice(2)}`
        }
        return t
      })
    } else if (event.nativeEvent.inputType === 'deleteContentBackward') {
      setTime((t) => {
        const nonZeros = t.replace(':', '').replaceAll('0', '')
        const digitString = nonZeros
          .slice(0, nonZeros.length - 1)
          .padStart(4, '0')
        return `${digitString.slice(0, 2)}:${digitString.slice(2)}`
      })
    }
  }

  return (
    <div className="flex gap-2">
      <input
        {...props}
        type="text"
        className="border-0 border-b focus:outline-none focus:border-gray-400 w-13"
        placeholder={placeholder}
        onInput={handleOnInput}
        value={time}
        dir="rtl"
        style={{ flexShrink: 5, flexBasis: '15px' }}
      />
      <label className="font-bold" htmlFor={props.name}>
        {props.label}
      </label>

      <div className="flex grow-20 w-20" />
    </div>
  )
}
