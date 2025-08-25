import type { DetailedHTMLProps, TextareaHTMLAttributes } from 'react'
import { mergeCss } from '../utils'

type TextAreaProps = Omit<
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  'style'
> & {
  variant?: 'shadowLT' | 'shadowRB'
  onResize?: (_height: number) => void
}
export const TextArea = ({ variant = 'shadowLT', ...props }: TextAreaProps) => {
  const placeHolder = props.placeholder ? `${props.placeholder}...` : undefined

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(event)
    handleResize()
  }

  const handleResize = () => {
    if (
      props.ref &&
      'current' in props.ref &&
      props.ref.current &&
      props.ref.current.clientHeight < props.ref.current.scrollHeight
    ) {
      props.ref.current.style.overflow = 'hidden'
      props.onResize?.(props.ref.current.scrollHeight)
    }
  }

  return (
    <textarea
      {...props}
      className={mergeCss(
        'border-1 p-2 focus:outline-none',
        {
          'shadow-[-4px_-4px]': variant === 'shadowLT',
          'shadow-[4px_4px]': variant === 'shadowRB',
        },
        props.className,
      )}
      name={props.name}
      placeholder={placeHolder}
      style={{
        resize: 'none',
      }}
      onChange={handleInputChange}
    />
  )
}
