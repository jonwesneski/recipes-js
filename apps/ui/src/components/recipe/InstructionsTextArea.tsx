'use client'

import { TextArea } from '@repo/ui'
import { useRecipeStepInstructionsStore } from '@src/providers/recipe-store-provider'
import { rem } from '@src/utils/rem'
import { type RefObject, useEffect, useRef } from 'react'

const placeholder = `The instructions for this step`

interface InstructionsTextAreaProps {
  ref?: RefObject<HTMLTextAreaElement | null>
  onResize: (_height: number) => void
}
export const InstructionsTextArea = (props: InstructionsTextAreaProps) => {
  let textAreaRef = useRef<HTMLTextAreaElement>(null)
  textAreaRef = props.ref ?? textAreaRef
  const {
    instructions,
    setInstructions,
    shouldBeFocused,
    insertInstructionsSteps,
  } = useRecipeStepInstructionsStore(textAreaRef)

  useEffect(() => {
    if (textAreaRef.current && shouldBeFocused) {
      textAreaRef.current.focus()
      textAreaRef.current.setSelectionRange(
        textAreaRef.current.value.length,
        textAreaRef.current.value.length,
      )
    }
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(event.target.value)
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
    insertInstructionsSteps(data)
  }

  return (
    <TextArea
      ref={textAreaRef}
      value={instructions}
      placeholder={placeholder}
      minHeight={rem(120)}
      minWidth={rem(270)}
      onChange={handleInputChange}
      onResize={props.onResize}
      onPaste={handleOnPaste}
      data-testid="instructions-text-area"
    />
  )
}
