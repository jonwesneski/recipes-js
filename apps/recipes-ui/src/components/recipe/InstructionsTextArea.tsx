'use client'

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
    handleResize()
  }

  const handleResize = () => {
    if (
      inputRef.current &&
      inputRef.current.clientHeight < inputRef.current.scrollHeight
    ) {
      inputRef.current.style.overflow = 'hidden'
      props.onResize(inputRef.current.scrollHeight)
    }
  }

  return (
    <textarea
      value={inputValue}
      onChange={handleInputChange}
      ref={inputRef}
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        resize: 'none',
        height: '100%',
      }}
    />
  )
}
