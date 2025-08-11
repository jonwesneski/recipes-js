import { UnderLabel } from '../Label'
import { Text, type TextProps } from './Text'

interface TextLabelProps {
  name: string
  placeholder: string
  label: string
  isRequired: boolean
  ref?: React.Ref<HTMLInputElement>
  variant?: TextProps['variant']
  error?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}
export const TextLabel = (props: TextLabelProps) => {
  return (
    <UnderLabel
      text={props.label}
      isRequired={props.isRequired}
      error={props.error}
      htmlFor={props.name}
    >
      <Text
        ref={props.ref}
        id={props.name}
        name={props.name}
        data-error-for={props.name}
        placeholder={props.placeholder}
        variant={props.variant}
        className="border-b-0"
        onChange={props.onChange}
      />
    </UnderLabel>
  )
}
