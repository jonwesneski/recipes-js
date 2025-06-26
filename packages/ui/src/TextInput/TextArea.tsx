/* eslint-disable @typescript-eslint/consistent-type-definitions -- type ok here */
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
  onResize: (_height: number) => void
}
export const TextArea = (props: TextAreaProps) => {
  const placeHolder = props.placeholder ? `${props.placeholder}...` : undefined

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(event)
    handleResize()
  }

  const handleResize = () => {
    if (
      props.ref?.current &&
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
      }}
      onChange={handleInputChange}
    />
  )
}
