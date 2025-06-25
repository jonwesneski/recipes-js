import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

type InputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'style' | 'className' | 'type'
>
export const SharedInput = (props: InputProps) => {
  const placeHolder = props.placeholder ? `${props.placeholder}...` : undefined
  return (
    <input
      {...props}
      type="text"
      className="border-0 border-b focus:outline-none focus:border-gray-300"
      placeholder={placeHolder}
    />
  )
}
