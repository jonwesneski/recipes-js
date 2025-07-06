import clsx from 'clsx'
import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

export type InputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'style' | 'className' | 'type'
> & { variant?: 'ellipses' | 'none'; isBlock?: boolean }
export const Text = ({ variant, isBlock = false, ...props }: InputProps) => {
  const placeHolder =
    (variant === undefined || variant === 'ellipses') && props.placeholder
      ? `${props.placeholder}...`
      : props.placeholder

  return (
    <input
      {...props}
      type="text"
      className={clsx(
        'pl-2 border-0 border-b focus:outline-none focus:border-gray-500 focus:bg-amber-700',
        { block: isBlock },
      )}
      placeholder={placeHolder}
    />
  )
}
