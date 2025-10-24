import { ClassValue } from 'clsx'
import { mergeCss } from '../utils'
import { type ButtonProps } from './Button'

export type IconButtonProps = Omit<ButtonProps, 'children'> & {
  svgIcon: React.FC<React.SVGProps<SVGSVGElement>>
  svgClassName?: ClassValue
}
export const IconButton = ({
  type = 'button',
  svgIcon: SvgIcon,
  svgClassName,
  ...props
}: IconButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={mergeCss(
        'p-1 cursor-pointer hover:scale-110',
        props.className,
      )}
    >
      <SvgIcon className={mergeCss('w-6 h-6', svgClassName)} />
    </button>
  )
}
