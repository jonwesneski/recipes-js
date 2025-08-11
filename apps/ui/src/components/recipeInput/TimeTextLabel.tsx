import { Label } from '@repo/design-system'
import {
  useRef,
  useState,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from 'react'

export type TimeTextLabelProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'style' | 'className' | 'type' | 'onChange'
> & { label: string; onChange: (_value: string) => void }
export const TimeTextLabel = (_props: TimeTextLabelProps) => {
  const { onChange, ...props } = _props
  const placeholder = '00:00'
  const [time, setTime] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOnInput = (event: React.InputEvent<HTMLInputElement>) => {
    if (
      event.nativeEvent.inputType === 'insertText' &&
      event.nativeEvent.data &&
      !isNaN(parseInt(event.nativeEvent.data))
    ) {
      setTime((t) => {
        const digitString =
          `${t.replace(':', '').replace(/^0+/, '')}${event.nativeEvent.data}`.padStart(
            4,
            '0',
          )
        if (digitString.length <= 4) {
          const result = transformResult(digitString)
          onChange(result)
          return result
        }
        return t
      })
    } else if (event.nativeEvent.inputType === 'deleteContentBackward') {
      setTime((t) => {
        const nonZeros = t.replace(':', '').replaceAll('0', '')
        const digitString = nonZeros
          .slice(0, nonZeros.length - 1)
          .padStart(4, '0')
        const result = transformResult(digitString)
        onChange(result)
        return result
      })
    }
  }

  const transformResult = (digitString: string) => {
    if (digitString === '0000') {
      return ''
    }
    return `${digitString.slice(0, 2)}:${digitString.slice(2)}`
  }

  return (
    <div className="flex gap-2">
      <input
        {...props}
        ref={inputRef}
        id={props.name}
        type="text"
        inputMode="numeric"
        pattern="[0-9]{2}:[0-9]{2}"
        className="border-0 border-b focus:outline-none focus:border-gray-400 w-13"
        placeholder={placeholder}
        onInput={handleOnInput}
        value={time}
        dir="rtl"
        style={{ flexShrink: 5, flexBasis: '15px' }}
        data-testid="time-input"
      />
      <Label className="font-bold" text={props.label} htmlFor={props.id} />

      <div className="flex grow-20 w-20" />
    </div>
  )
}
