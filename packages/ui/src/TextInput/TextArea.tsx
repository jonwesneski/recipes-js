import type {
  DetailedHTMLProps,
  RefObject,
  TextareaHTMLAttributes,
} from 'react'

type TextAreaProps = Omit<
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  'style' | 'className' | 'ref'
> & {
  ref: RefObject<HTMLTextAreaElement | null>
  minWidth?: string | number
  minHeight?: string | number
  maxWidth?: string | number
  width?: string | number
  onResize: (_height: number) => void
}
export const TextArea = ({
  minWidth,
  minHeight,
  maxWidth,
  width,
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
      className="border-1 h-full p-2 m-2"
      placeholder={placeHolder}
      style={{
        resize: 'none',
        width,
        minHeight,
        minWidth,
        maxWidth,
      }}
      onChange={handleInputChange}
    />
  )
}
