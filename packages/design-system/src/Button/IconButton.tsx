import { mergeCss } from '../utils'
import { ButtonProps } from './Button'

export type IconButtonProps = Omit<ButtonProps, 'children'> & {
  svgIcon: React.FC<React.SVGProps<SVGSVGElement>>
}
export const IconButton = ({
  type = 'button',
  svgIcon: SvgIcon,
  ...props
}: IconButtonProps) => {
  return (
    <>
      <button
        {...props}
        type={type}
        className={mergeCss(
          'p-1 cursor-pointer hover:scale-110',
          props.className,
        )}
      >
        <SvgIcon className="w-6 h-6 fill-text" />
      </button>
    </>
  )
}
