import { Button, ButtonProps } from './CustomButton'

export type TextButtonProps = Omit<ButtonProps, 'children'> & {
  text: string
}
export const TextButton = (props: TextButtonProps) => {
  return <Button {...props}>{`${props.text}.`}</Button>
}
