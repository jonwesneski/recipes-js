'use client'

import { IngredientValidator } from '@src/utils/ingredientsValidator'
import { type AllMeasurements } from '@src/utils/measurements'
import { fractionRegex } from '@src/zod-schemas'
import React, { useEffect, useState } from 'react'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

type PositionType = { row: number; column: number }

interface IngriedientRowProps {
  ref: React.RefObject<HTMLTextAreaElement | null>
  placeholder?: string
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
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (props.focusOnMount && props.ref.current) {
      props.ref.current.selectionStart = props.ref.current.value.length
      props.ref.current.selectionEnd = props.ref.current.value.length
      props.ref.current.focus()
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
        props.onEnterPressed(props.ref)
        break
      case 'Backspace':
        if (event.currentTarget.value === '') {
          props.onRemove(props.ref)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        props.onArrowUp(props.ref)
        break
      case 'ArrowDown':
        event.preventDefault()
        props.onArrowDown(props.ref)
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
        props.onChange(props.ref, ingredientValidator)
        break
      case 'insertFromPaste':
        props.onPaste(props.ref, event.currentTarget.value)
        break
      case 'deleteContentBackward':
        _handleShowPopUp(ingredientValidator)
        props.onChange(props.ref, ingredientValidator)
        break
      default:
        console.log(`Unsupported input type: ${inputType}`)
    }
  }

  const _handleShowPopUp = (ingredientValidator: IngredientValidator) => {
    if (props.ref.current) {
      const rect = props.ref.current.getBoundingClientRect()
      const position = getCaretPosition(props.ref.current)
      // has unit error and is caret in measurement-unit column
      if (
        ingredientValidator.error?.issues[0].message.includes('unit') &&
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
    const text = props.ref.current?.textContent
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
      props.ref,
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
        ref={props.ref}
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
}
