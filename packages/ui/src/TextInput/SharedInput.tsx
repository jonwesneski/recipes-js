import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

type InputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'style' | 'className' | 'type'
> & { variant?: 'ellipses' | 'none' }
export const SharedInput = ({ variant, ...props }: InputProps) => {
  const placeHolder =
    (variant === undefined || variant === 'ellipses') && props.placeholder
      ? `${props.placeholder}...`
      : props.placeholder
  return (
    <input
      {...props}
      type="text"
      className="border-0 border-b focus:outline-none focus:border-gray-300"
      placeholder={placeHolder}
    />
  )
}
