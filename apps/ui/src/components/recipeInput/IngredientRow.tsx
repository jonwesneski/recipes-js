'use client'

import { Label, mergeCss } from '@repo/design-system'
import useMediaQuery from '@src/hooks/useMediaQuery'
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

interface IIngriedientRowProps {
  keyId: string
  label?: string
  htmlFor?: string
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
  IIngriedientRowProps
>((props, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [isFocused, setIsFocused] = useState(false)
  const { width, breakpointPxs } = useMediaQuery()

  useEffect(() => {
    if (props.focusOnMount && textareaRef.current) {
      textareaRef.current.selectionStart = textareaRef.current.value.length
      textareaRef.current.selectionEnd = textareaRef.current.value.length
      textareaRef.current.focus()
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
    const fieldErrors = ingredientValidator.error?.fieldErrors
    if (!fieldErrors) {
      _handleMeasurementPopUp()
    }
  }

  const _handleMeasurementPopUp = () => {
    if (textareaRef.current) {
      const position = getCaretPosition(textareaRef.current)
      if (position.column === 1) {
        let yOffset = -150
        if (!(width < breakpointPxs.md)) {
          const y = position.row + 1
          const yMultipler = y * 10
          yOffset = 40 + yMultipler
        }
        const rect = textareaRef.current.getBoundingClientRect()
        setPopupPosition({
          x: rect.x,
          y: yOffset,
        })
        setIsPopupVisible(true)
      }
    }
  }

  const handleMeasurementInPopupClick = (value: AllMeasurements): void => {
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

  const handleHideMeasurementPopUp = (): void => {
    setIsPopupVisible(false)
  }

  const handleFocused = (): void => {
    setIsFocused(true)
    _handleMeasurementPopUp()
  }

  return (
    <>
      <textarea
        data-testid="ingredient-row"
        rows={1}
        ref={textareaRef}
        id={props.htmlFor}
        className="block focus:outline-none bg-transparent resize-none w-full"
        name="ingredient-row"
        placeholder={isFocused && !props.value ? props.placeholder : undefined}
        value={props.value}
        onSelect={handleFocused}
        onBlur={() => setIsFocused(false)}
        onInput={handleInput}
        onPaste={handleOnPaste}
        onKeyDown={handleKeyDown}
      />
      {props.value && props.error && props.error.length > 0 ? (
        <div className="text-text-error text-sm mt-1 bg-transparent">
          {props.error}
        </div>
      ) : null}

      <IngredientsMeasurementPopUp
        top={popupPosition.y}
        left={popupPosition.x}
        onClick={handleMeasurementInPopupClick}
        onBlur={handleHideMeasurementPopUp}
        className={mergeCss(`transition-transform duration-300 ease-in`, {
          'scale-y-100': isPopupVisible,
          'scale-y-0': !isPopupVisible,
        })}
        style={{
          transformOrigin: width < breakpointPxs.md ? 'bottom' : 'top',
        }}
      />
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
