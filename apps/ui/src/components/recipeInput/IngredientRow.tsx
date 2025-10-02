'use client'

import { IngredientValidator } from '@src/utils/ingredientsValidator'
import { type AllMeasurements } from '@src/utils/measurements'
import { fractionRegex } from '@src/zod-schemas'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

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

interface IngriedientRowProps {
  keyId: string
  placeholder?: string
  value: string
  error?: string
  focusOnMount: boolean
  onChange: (_keyId: string, _value: IngredientValidator) => void
  onPaste: (_keyId: string, _value: string) => void
  onEnterPressed: (_keyId: string) => void
  onArrowUp: (_keyId: string) => void
  onArrowDown: (_keyId: string) => void
  onRemove: (_keyId: string) => void
}
export const IngredientRow = forwardRef<
  IngredientRowHandle,
  IngriedientRowProps
>((props, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (props.focusOnMount && textareaRef.current) {
      textareaRef.current.selectionStart = textareaRef.current.value.length
      textareaRef.current.selectionEnd = textareaRef.current.value.length
      textareaRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)')

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsSmallScreen(event.matches)
    }

    setIsSmallScreen(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    getElement: () => textareaRef.current,
    getValue: () => textareaRef.current?.value,
    getSelectionStart: () => textareaRef.current?.selectionStart,
    focus: () => textareaRef.current?.focus(),
    setSelectionRange: (start, end, direction) =>
      textareaRef.current?.setSelectionRange(start, end, direction),
  }))

  const getCaretPosition = (element: HTMLTextAreaElement) => {
    const position: { row: number; column: number } = {
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
        props.onEnterPressed(props.keyId)
        break
      case 'Backspace':
        if (event.currentTarget.value === '') {
          props.onRemove(props.keyId)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        props.onArrowUp(props.keyId)
        break
      case 'ArrowDown':
        event.preventDefault()
        props.onArrowDown(props.keyId)
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
        props.onChange(props.keyId, ingredientValidator)
        break
      case 'insertFromPaste':
        props.onPaste(props.keyId, event.currentTarget.value)
        break
      case 'deleteContentBackward':
        _handleShowPopUp(ingredientValidator)
        props.onChange(props.keyId, ingredientValidator)
        break
      default:
        console.log(`Unsupported input type: ${inputType}`)
    }
  }

  const _handleShowPopUp = (ingredientValidator: IngredientValidator) => {
    if (textareaRef.current) {
      const rect = textareaRef.current.getBoundingClientRect()
      const position = getCaretPosition(textareaRef.current)
      // Amount is okay and has unit error and caret is in measurement-unit column
      const fieldErrors = ingredientValidator.error?.fieldErrors
      if (
        fieldErrors &&
        fieldErrors.amount === undefined &&
        fieldErrors.unit?.[0] &&
        position.column === 1
      ) {
        _handleMeasurementPopUp(position, rect)
      }
    }
  }

  const _handleMeasurementPopUp = (position: PositionType, rect: DOMRect) => {
    const y = position.row + 1
    let yMultipler = y * 10
    yMultipler = isSmallScreen ? -yMultipler : yMultipler
    const yOffset = isSmallScreen ? -50 : 150
    setPopupPosition({
      x: rect.x,
      y: rect.y + yMultipler + yOffset,
    })
    setIsPopupVisible(true)
  }

  function handleMeasurementClick(value: AllMeasurements): void {
    const text = textareaRef.current?.textContent
    if (!text) {
      return
    }

    const items = text.split(' ')
    if (fractionRegex.test(items[1])) {
      items[2] = value
    } else {
      items[1] = value
    }
    props.onChange(
      props.keyId,
      new IngredientValidator({ stringValue: items.join(' ') }),
    )
    setIsPopupVisible(false)
  }

  function handleHideMeasurement(): void {
    setIsPopupVisible(false)
  }

  return (
    <>
      <textarea
        data-testid="ingredient-row"
        rows={1}
        ref={textareaRef}
        className="block focus:outline-none bg-transparent resize-none"
        name="ingredient-row"
        placeholder={props.placeholder}
        value={props.value}
        onInput={handleInput}
        onPaste={handleOnPaste}
        onKeyDown={handleKeyDown}
      />
      {props.value && props.error && props.error.length > 0 ? (
        <div className="text-red-900 text-sm mt-1 bg-transparent">
          {props.error}
        </div>
      ) : null}
      {isPopupVisible ? (
        <IngredientsMeasurementPopUp
          top={popupPosition.y}
          left={popupPosition.x}
          onClick={handleMeasurementClick}
          onBlur={handleHideMeasurement}
        />
      ) : null}
    </>
  )
})
IngredientRow.displayName = 'IngredientRow'
