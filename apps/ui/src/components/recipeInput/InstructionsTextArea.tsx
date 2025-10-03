'use client'

import { type ClassValue, mergeCss, TextAreaLabel } from '@repo/design-system'
import { useRecipeStepInstructionsStore } from '@src/providers/recipe-store-provider'
import { useEffect, useRef } from 'react'

const placeholder = `The instructions for this step`

interface InstructionsTextAreaProps {
  keyId: string
  stepNumber: number
  className?: ClassValue
  onResize: (_height: number) => void
}
export const InstructionsTextArea = (props: InstructionsTextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const { instructions, setInstructions, insertInstructionsSteps } =
    useRecipeStepInstructionsStore(props.keyId)

  useEffect(() => {
    if (textAreaRef.current && instructions?.shouldBeFocused) {
      textAreaRef.current.focus()
      textAreaRef.current.setSelectionRange(
        textAreaRef.current.value.length,
        textAreaRef.current.value.length,
      )
    }
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(props.keyId, event.target.value)
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
    insertInstructionsSteps(props.keyId, data)
  }

  const handleOnResize = (height: number) => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `${height}px`
    }
  }

  return (
    <TextAreaLabel
      ref={textAreaRef}
      className={mergeCss('h-full min-h-32 w-full', props.className)}
      name="instructions"
      id={`step ${props.stepNumber} instructions`}
      label="instructions"
      isRequired={false}
      value={instructions?.value}
      placeholder={placeholder}
      onChange={handleInputChange}
      onResize={handleOnResize}
      onPaste={handleOnPaste}
      data-testid="instructions-text-area"
    />
  )
}
