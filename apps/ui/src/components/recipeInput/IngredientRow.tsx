'use client'

import { Label, mergeCss } from '@repo/design-system'
import { IngredientValidator } from '@src/utils/ingredientsValidator'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

type PositionType = { row: number; column: number }

export interface IngredientRowHandle {
  getElement: () => HTMLTextAreaElement | null
  getValue: () => string | undefined
  getSelectionStart: () => number | undefined
  focus: () => void
  setSelectionRange: (
    _start: number | null,
    _end: number | null,
    _direction?: 'none' | 'forward' | 'backward',
  ) => void
}

interface IIngriedientRowProps {
  ingredientId: string
  label?: string
  htmlFor?: string
  placeholder?: string
  value: string
  error?: string
  onChange: (_keyId: string, _value: string) => void
  onMeasurementInput: (
    _keyId: string | null,
    _element: HTMLTextAreaElement | null,
  ) => void
  onPaste: (_keyId: string, _value: string) => void
  onEnterPressed: (_keyId: string) => void
  onArrowUp: (_keyId: string) => void
  onArrowDown: (_keyId: string) => void
  onRemove: (_keyId: string) => void
}
export const IngredientRow = forwardRef<
  IngredientRowHandle,
  IIngriedientRowProps
>((props, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useImperativeHandle(ref, () => ({
    getElement: () => textareaRef.current,
    getValue: () => textareaRef.current?.value,
    getSelectionStart: () => textareaRef.current?.selectionStart,
    focus: () => textareaRef.current?.focus(),
    setSelectionRange: (start, end, direction) =>
      textareaRef.current?.setSelectionRange(start, end, direction),
  }))

  const getCaretPosition = (element: HTMLTextAreaElement) => {
    const position: PositionType = {
      row: 0,
      column: 0,
    }

    // Calcuate row position
    // // do we care about row position?
    const cursorPosition = element.selectionStart || 0
    const textBeforeCursor = element.value.substring(0, cursorPosition)
    const row = textBeforeCursor.split('\n').length

    // Calculate column position we have 3 columns in textarea
    const currentRowText = textBeforeCursor.split('\n')[row - 1] || ''
    const column = currentRowText.split(' ').length

    position.row = row - 1
    position.column = column - 1

    return position
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        props.onEnterPressed(props.ingredientId)
        break
      case 'Backspace':
        if (event.currentTarget.value === '') {
          props.onRemove(props.ingredientId)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        props.onArrowUp(props.ingredientId)
        break
      case 'ArrowDown':
        event.preventDefault()
        props.onArrowDown(props.ingredientId)
        break
      default:
        break
    }
  }

  /** This is just for testing purposes; I can't get a textarea to do a
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
    const ingredientValidator = new IngredientValidator({
      stringValue: event.currentTarget.value,
    })
    switch (inputType) {
      case 'insertText':
        _handleShowPopUp(ingredientValidator)
        props.onChange(props.ingredientId, event.currentTarget.value)
        break
      case 'insertFromPaste':
        props.onPaste(props.ingredientId, event.currentTarget.value)
        break
      case 'deleteContentBackward':
        _handleShowPopUp(ingredientValidator)
        props.onChange(props.ingredientId, event.currentTarget.value)
        break
      default:
        console.log(`Unsupported input type: ${inputType}`)
    }
  }

  const _handleShowPopUp = (ingredientValidator: IngredientValidator) => {
    const fieldErrors = ingredientValidator.error?.fieldErrors
    if (!fieldErrors) {
      _handleMeasurementPopUp()
    }
  }

  const _handleMeasurementPopUp = () => {
    if (textareaRef.current) {
      const position = getCaretPosition(textareaRef.current)
      if (position.column === 1) {
        props.onMeasurementInput(props.ingredientId, textareaRef.current)
      } else {
        props.onMeasurementInput(null, null)
      }
    }
  }

  const handleFocused = (): void => {
    setIsFocused(true)
    _handleMeasurementPopUp()
  }

  return (
    <>
      <div className="flex bg-[var(--bg-current)]">
        {isFocused || props.value ? (
          <svg className="w-3 h-3 mr-2 mt-1 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
          </svg>
        ) : null}

        {/**
         * I'm using another textarea here because copy & paste keeps the linebreaks where as
         * other elements don't. Max rows is set to 1 to make it seem like an <input />
         */}
        <textarea
          data-testid="ingredient-row"
          rows={1}
          ref={textareaRef}
          id={props.htmlFor}
          className="block focus:outline-none resize-none flex-1"
          name="ingredient-row"
          placeholder={
            isFocused && !props.value ? props.placeholder : undefined
          }
          value={props.value}
          onSelect={handleFocused}
          onBlur={() => setIsFocused(false)}
          onInput={handleInput}
          onPaste={handleOnPaste}
          onKeyDown={handleKeyDown}
        />
        {props.value ? (
          <button
            className="border border-dashed px-1.5 cursor-pointer bg-[var(--bg-current)]"
            type="button"
            onClick={() => props.onRemove(props.ingredientId)}
          >
            x
          </button>
        ) : null}
      </div>
      {props.value && props.error && props.error.length > 0 ? (
        <div className="text-text-error text-sm mt-1 bg-transparent">
          {props.error}
        </div>
      ) : null}

      {props.label ? (
        <Label
          htmlFor={props.htmlFor}
          text={props.label}
          className={mergeCss(
            'absolute left-3 top-2 transition-all cursor-text font-bold text-text/35',
            {
              'text-xs top-0 text-text': isFocused || props.value,
            },
          )}
          onClick={() => {
            setIsFocused(true)
            textareaRef.current?.focus()
          }}
        />
      ) : null}
    </>
  )
})
IngredientRow.displayName = 'IngredientRow'
