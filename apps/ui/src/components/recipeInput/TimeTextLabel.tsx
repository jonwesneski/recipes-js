import { TextLabel } from '@repo/design-system'
import { useState } from 'react'

export type TimeTextLabelProps = Omit<
  React.ComponentPropsWithRef<'input'>,
  'style' | 'className' | 'type' | 'onChange'
> & { label: string; onChange: (_value: string) => void }
export const TimeTextLabel = (_props: TimeTextLabelProps) => {
  const { onChange, ...props } = _props
  const [time, setTime] = useState('')

  const handleOnInput = (event: React.InputEvent<HTMLInputElement>) => {
    if (
      event.nativeEvent.inputType === 'insertText' &&
      event.nativeEvent.data &&
      !isNaN(parseInt(event.nativeEvent.data))
    ) {
      const digitString =
        `${time.replace(':', '').replace(/^0+/, '')}${event.nativeEvent.data}`.padStart(
          4,
          '0',
        )
      if (digitString.length <= 4) {
        const result = transformResult(digitString)
        setTime(result)
        onChange(result)
      }
    } else if (event.nativeEvent.inputType === 'deleteContentBackward') {
      const nonZeros = time.replace(':', '').replaceAll('0', '')
      const digitString = nonZeros
        .slice(0, nonZeros.length - 1)
        .padStart(4, '0')
      const result = transformResult(digitString)
      setTime(result)
      onChange(result)
    }
  }

  const transformResult = (digitString: string) => {
    if (digitString === '0000') {
      return ''
    }
    return `${digitString.slice(0, 2)}:${digitString.slice(2)}`
  }

  return (
    <TextLabel
      {...props}
      name={props.label}
      inputMode="numeric"
      pattern="[0-9]{2}:[0-9]{2}"
      className="w-28"
      label={props.label}
      placeholder={'00:00'}
      isRequired={false}
      onInput={handleOnInput}
      value={time}
      dir="rtl"
      variant="none"
      style={{ flexShrink: 5, flexBasis: '15px' }}
      data-testid="time-input"
    />
  )
}
