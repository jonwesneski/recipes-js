import type { DetailedHTMLProps, LabelHTMLAttributes } from 'react'

type LabelProps = Omit<
  DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
  'style' | 'className' | 'type'
> & { text: string }
export const Label = ({ text, ...props }: LabelProps) => {
  return (
    <label {...props} className="font-bold">
      {text}
    </label>
  )
}
