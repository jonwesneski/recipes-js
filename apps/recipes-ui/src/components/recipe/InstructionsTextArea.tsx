'use client'

import { TextArea } from '@repo/ui'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { type RefObject, useEffect, useRef, useState } from 'react'

interface InstructionsTextAreaProps {
  ref?: RefObject<HTMLTextAreaElement | null>
  instructions: string
  onTextChange: (_instructions: string) => void
  //onTextChangeError: (_error: ZodError<IngredientDto[]>) => void
  onPaste: (_data: string[]) => void
  onResize: (_height: number) => void
}
export const InstructionsTextArea = (props: InstructionsTextAreaProps) => {
  const [inputValue, setInputValue] = useState(props.instructions)
  const { shouldBeFocused } = useRecipeStore((state) => state)
  let textAreaRef = useRef<HTMLTextAreaElement>(null)
  textAreaRef = props.ref ?? textAreaRef

  useEffect(() => {
    if (textAreaRef.current && shouldBeFocused(textAreaRef)) {
      textAreaRef.current.focus()
      textAreaRef.current.setSelectionRange(
        textAreaRef.current.value.length,
        textAreaRef.current.value.length,
      )
    }
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
  }

  /* When some pastes in recipes that are already separated by '\r\n\r\n'
   * we will add new steps for them
   */
  const handleOnPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    const stringData = event.clipboardData.getData('text/plain')
    const data = stringData.includes('\r')
      ? stringData.split('\r\n\r\n')
      : stringData.split('\n\n')
    props.onPaste(data)
  }

  return (
    <TextArea
      ref={textAreaRef}
      value={inputValue}
      onChange={handleInputChange}
      onResize={props.onResize}
      onPaste={handleOnPaste}
    />
  )
}
