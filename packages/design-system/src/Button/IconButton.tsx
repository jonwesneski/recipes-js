import Image from 'next/image'
import { mergeCss } from '../utils'
import { ButtonProps } from './Button'

export type IconButtonProps = Omit<ButtonProps, 'children'> & {
  imageUrl: string
  altText: string
}
export const IconButton = ({
  type = 'button',
  imageUrl,
  altText,
  ...props
}: IconButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={mergeCss('p-1 cursor-pointer', props.className)}
    >
      <Image src={imageUrl} alt={altText} width={24} height={24} />
    </button>
  )
}
