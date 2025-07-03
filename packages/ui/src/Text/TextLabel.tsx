import { Label } from '../Label'
import { Text, type InputProps } from './Text'

interface TextLabelProps {
  name: string
  placeholder: string
  label: string
  variant?: InputProps['variant']
}
export const TextLabel = (props: TextLabelProps) => {
  return (
    <div className="[&>*]:block">
      <Text
        name={props.name}
        placeholder={props.placeholder}
        variant={props.variant}
      />
      <Label text={props.label} htmlFor={props.name} />
    </div>
  )
}
