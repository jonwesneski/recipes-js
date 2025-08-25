import Image from 'next/image'
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { mergeCss } from '../utils'

export type IconButtonProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'style'
> & { imageUrl: string; altText: string }
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
