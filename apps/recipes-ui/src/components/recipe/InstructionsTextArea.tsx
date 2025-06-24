'use client'

import { TextArea } from '@repo/ui'
import { useRef, useState } from 'react'

interface IngredientsTextAreaProps {
  instructions: string
  onTextChange: (_instructions: string) => void
  //onTextChangeError: (_error: ZodError<IngredientDto[]>) => void
  onPaste: (_data: string[]) => void
  onResize: (_height: number) => void
}
export const InstructionsTextArea = (props: IngredientsTextAreaProps) => {
  const [inputValue, setInputValue] = useState(props.instructions)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <TextArea
      ref={inputRef}
      value={inputValue}
      onChange={handleInputChange}
      onResize={props.onResize}
    />
  )
}
