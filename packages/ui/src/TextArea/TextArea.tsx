import type {
  DetailedHTMLProps,
  RefObject,
  TextareaHTMLAttributes,
} from 'react'
import { mergeCss } from '../utils'

type TextAreaProps = Omit<
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  'style' | 'className' | 'ref'
> & {
  ref: RefObject<HTMLTextAreaElement | null>
  variant?: 'shadowLT' | 'shadowRB'
  minWidth?: string | number
  minHeight?: string | number
  maxWidth?: string | number
  width?: string | number
  className?: string
  onResize: (_height: number) => void
}
export const TextArea = ({
  variant = 'shadowLT',
  className,
  ...props
}: TextAreaProps) => {
  const placeHolder = props.placeholder ? `${props.placeholder}...` : undefined

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(event)
    handleResize()
  }

  const handleResize = () => {
    if (
      props.ref.current &&
      props.ref.current.clientHeight < props.ref.current.scrollHeight
    ) {
      props.ref.current.style.overflow = 'hidden'
      props.onResize(props.ref.current.scrollHeight)
    }
  }

  return (
    <textarea
      {...props}
      className={mergeCss(
        'border-1 p-2 m-2 focus:outline-none',
        {
          'shadow-[-4px_-4px]': variant === 'shadowLT',
          'shadow-[4px_4px]': variant === 'shadowRB',
        },
        className,
      )}
      placeholder={placeHolder}
      style={{
        resize: 'none',
      }}
      onChange={handleInputChange}
    />
  )
}
