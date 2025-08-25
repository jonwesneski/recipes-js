import { Button, type ButtonProps } from './Button'

export type TextButtonProps = Omit<ButtonProps, 'children'> & {
  text: string
}
export const TextButton = (props: TextButtonProps) => {
  return <Button {...props}>{`${props.text}.`}</Button>
}
