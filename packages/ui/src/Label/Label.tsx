import type { DetailedHTMLProps, LabelHTMLAttributes } from 'react'
import { mergeCss } from '../utils'

type LabelProps = Omit<
  DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
  'style' | 'type'
> & { text: string }
export const Label = ({ text, ...props }: LabelProps) => {
  return (
    <label {...props} className={mergeCss('font-bold', props.className)}>
      {text}
    </label>
  )
}
