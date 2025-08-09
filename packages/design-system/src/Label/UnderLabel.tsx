import type { DetailedHTMLProps, LabelHTMLAttributes, ReactNode } from 'react'
import { mergeCss } from '../utils'
import { Label } from './Label'

type LabelProps = Omit<
  DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
  'style'
> & { text: string; isRequired: boolean; error?: string; children: ReactNode }
export const UnderLabel = (props: LabelProps) => {
  return (
    <div className="relative flex flex-col">
      {Boolean(props.isRequired) && (
        <span className="absolute -left-3 text-red-900">*</span>
      )}
      {props.children}
      <Label
        className={mergeCss('block border-0 border-t', {
          'border-t-red-900': props.error,
          'text-red-900': props.error,
        })}
        text={props.error ? `${props.text} ${props.error}` : props.text}
        htmlFor={props.htmlFor}
      />
    </div>
  )
}
