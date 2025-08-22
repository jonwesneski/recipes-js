import { CustomButton, CustomButtonProps } from './CustomButton'

export type ButtonProps = Omit<CustomButtonProps, 'children'> & { text: string }
export const Button = (props: ButtonProps) => {
  return <CustomButton {...props}>{`${props.text}.`}</CustomButton>
}
