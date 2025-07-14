'use client'

import { IngredientValidator } from '@src/utils/ingredientsValidator'
import React, { useEffect } from 'react'

interface IngriedientRowProps {
  ref: React.RefObject<HTMLTextAreaElement | null>
  value: string
  error?: string
  focusOnMount: boolean
  onChange: (
    _ref: React.RefObject<HTMLTextAreaElement | null>,
    _value: IngredientValidator,
  ) => void
  onPaste: (
    _ref: React.RefObject<HTMLTextAreaElement | null>,
    _value: string,
  ) => void
  onEnterPressed: (_ref: React.RefObject<HTMLTextAreaElement | null>) => void
  onArrowUp: (_ref: React.RefObject<HTMLTextAreaElement | null>) => void
  onArrowDown: (_ref: React.RefObject<HTMLTextAreaElement | null>) => void
  onRemove: (_ref: React.RefObject<HTMLTextAreaElement | null>) => void
}
export const IngredientRow = (props: IngriedientRowProps) => {
  useEffect(() => {
    if (props.focusOnMount && props.ref.current) {
      const selection = window.getSelection()
      if (selection) {
        const range = document.createRange()
        range.setStart(props.ref.current, props.ref.current.value.length)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      props.ref.current.focus()
    }
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key) {
      case 'Enter':
        props.onEnterPressed(props.ref)
        event.preventDefault()
        break
      case 'Backspace':
        if (event.currentTarget.value === '') {
          props.onRemove(props.ref)
        }
        break
      case 'ArrowUp':
        props.onArrowUp(props.ref)
        break
      case 'ArrowDown':
        props.onArrowDown(props.ref)
        break
      default:
        break
    }
  }

  /** This is just for testing purposes; I can get a textarea to do a
   * navtiveEvent.inputType === 'insertFromPaste'. So, simulating here
   */
  const handleOnPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    handleInput({
      nativeEvent: { inputType: 'insertFromPaste' },
      currentTarget: { value: event.clipboardData.getData('text/plain') },
    } as unknown as React.InputEvent<HTMLTextAreaElement>)
  }

  const handleInput = (event: React.InputEvent<HTMLTextAreaElement>) => {
    const inputType = event.nativeEvent.inputType
    switch (inputType) {
      case 'insertText':
        props.onChange(
          props.ref,
          new IngredientValidator({
            stringValue: event.currentTarget.value,
          }),
        )
        break
      case 'insertFromPaste':
        props.onPaste(props.ref, event.currentTarget.value)
        break
      case 'deleteContentBackward':
        props.onChange(
          props.ref,
          new IngredientValidator({
            stringValue: event.currentTarget.value,
          }),
        )
        break
      default:
        console.log(`Unsupported input type: ${inputType}`)
    }
  }

  return (
    <>
      <textarea
        data-testid="ingredient-text-area"
        rows={1}
        ref={props.ref}
        className="block focus:outline-none bg-transparent resize-none"
        value={props.value}
        onInput={handleInput}
        onPaste={handleOnPaste}
        onKeyDown={handleKeyDown}
      />
      {props.error && props.error.length > 0 ? (
        <div className="text-red-500 text-sm mt-1 bg-transparent">
          {props.error}
        </div>
      ) : null}
    </>
  )
}
