import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { mergeCss } from '../utils'

export type InputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'style' | 'className' | 'type'
> & { variant?: 'ellipses' | 'none'; className?: string; isBlock?: boolean }
export const Text = ({ variant, isBlock = false, ...props }: InputProps) => {
  const placeHolder =
    (variant === undefined || variant === 'ellipses') && props.placeholder
      ? `${props.placeholder}...`
      : props.placeholder

  return (
    <input
      {...props}
      type="text"
      className={mergeCss(
        'pl-2 border-0 border-b focus:outline-none',
        {
          block: isBlock,
        },
        props.className,
      )}
      placeholder={placeHolder}
    />
  )
}
