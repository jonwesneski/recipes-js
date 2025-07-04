import { Label } from '../Label'
import { Text, type InputProps } from './Text'

interface TextLabelProps {
  name: string
  placeholder: string
  label: string
  isRequired: boolean
  variant?: InputProps['variant']
  error?: string
}
export const TextLabel = (props: TextLabelProps) => {
  return (
    <div className="relative">
      {props.isRequired && (
        <span className="absolute -left-3 text-red-900">*</span>
      )}

      <Text
        name={props.name}
        placeholder={props.placeholder}
        variant={props.variant}
        isBlock={true}
      />
      <Label text={`${props.label}`} htmlFor={props.name} />
      {props.error && (
        <span className="text-red-900">{`\u00A0-\u00A0${props.error}`}</span>
      )}
    </div>
  )
}
