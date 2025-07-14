'use client'

import { IngredientValidator } from '@src/utils/ingredientsValidator'
import React, { useEffect } from 'react'

interface IngriedientRowProps {
  id?: string
  ref: React.RefObject<HTMLInputElement | null>
  value: string
  error?: string
  focusOnMount: boolean
  onChange: (
    ref: React.RefObject<HTMLInputElement | null>,
    value: IngredientValidator,
  ) => void
  onEnterPressed: (ref: React.RefObject<HTMLInputElement | null>) => void
  onArrowUp: (ref: React.RefObject<HTMLInputElement | null>) => void
  onArrowDown: (ref: React.RefObject<HTMLInputElement | null>) => void
  onRemove: (ref: React.RefObject<HTMLInputElement | null>) => void
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
    console.log(props.focusOnMount, props.ref.current?.value)
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleInput = (event: React.InputEvent<HTMLInputElement>) => {
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
        console.log('Text pasted:', event.currentTarget.value)
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
      <input
        ref={props.ref}
        className="block focus:outline-none bg-transparent"
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
