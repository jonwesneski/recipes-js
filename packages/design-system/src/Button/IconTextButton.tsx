import { mergeCss } from '../utils'
import { Button, type ButtonProps } from './Button'

type IconTextButtonProps = Omit<ButtonProps, 'children'> & {
  svgIcon: React.FC<React.SVGProps<SVGSVGElement>>
  text: string
}
export const IconTextButton = ({
  svgIcon: SvgIcon,
  text,
  ...props
}: IconTextButtonProps) => {
  return (
    <Button
      {...props}
      className={mergeCss('flex items-start w-full', props.className)}
    >
      <SvgIcon className="mx-4 grow-0 stroke-text fill-text" />
      {`${text}.`}
    </Button>
  )
}
