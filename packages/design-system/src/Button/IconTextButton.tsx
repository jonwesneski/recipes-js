import Image from 'next/image'
import { mergeCss } from '../utils'
import { Button, ButtonProps } from './Button'

type IconTextButtonProps = Omit<ButtonProps, 'children'> & {
  icon: string
  altText: string
  text: string
}
export const IconTextButton = ({
  icon,
  altText,
  text,
  ...props
}: IconTextButtonProps) => {
  return (
    <Button
      {...props}
      className={mergeCss('flex items-start w-full', props.className)}
    >
      <Image src={icon} alt={altText} className="mx-4 grow-0" />
      {`${text}.`}
    </Button>
  )
}
