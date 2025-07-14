'use client'

import { IngredientValidator } from '@src/utils/ingredientsValidator'
import React, { useEffect } from 'react'

interface IngriedientRowProps {
  id?: string
  ref: React.RefObject<HTMLTextAreaElement | null>
  value: string
  error?: string
  focusOnMount: boolean
  onChange: (
    ref: React.RefObject<HTMLTextAreaElement | null>,
    value: IngredientValidator,
  ) => void
  onPaste: (
    ref: React.RefObject<HTMLTextAreaElement | null>,
    value: string,
  ) => void
  onEnterPressed: (ref: React.RefObject<HTMLTextAreaElement | null>) => void
  onArrowUp: (ref: React.RefObject<HTMLTextAreaElement | null>) => void
  onArrowDown: (ref: React.RefObject<HTMLTextAreaElement | null>) => void
  onRemove: (ref: React.RefObject<HTMLTextAreaElement | null>) => void
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
    <React.Fragment key={props.id}>
      {/* <input
        ref={props.ref}
        className="block focus:outline-none bg-transparent"
        value={props.value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      /> */}
      <textarea
        rows={1}
        ref={props.ref}
        className="block focus:outline-none bg-transparent resize-none"
        value={props.value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      />
      {props.error && (
        <div className="text-red-500 text-sm mt-1 bg-transparent">
          {props.error}
        </div>
      )}
    </React.Fragment>
  )
}
