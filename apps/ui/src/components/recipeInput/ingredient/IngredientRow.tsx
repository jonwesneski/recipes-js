'use client'

import { Label, mergeCss } from '@repo/design-system'
import { useMediaQuery } from '@src/hooks'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import {
  hasIngredientErrors,
  ingredientDisplayString,
  parseIngredientString,
} from '@src/utils/ingredientHelper'
import { type MeasurementUnitType } from '@src/utils/measurements'
import { fractionRegex } from '@src/zod-schemas'
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  dropDownModes,
  IngredientDropdown,
  type DropdownMode,
} from './IngredientDropdown'

type PositionType = { row: number; column: number }
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

  // Calculate column position we have 3 "columns"(fields) in textarea
  const currentRowText = textBeforeCursor.split('\n')[row - 1] || ''
  const column = currentRowText.split(' ').length

  position.row = row - 1
  position.column = column - 1

  return position
}

const setCaretColumn = (element: HTMLTextAreaElement, column: number) => {
  const line = element.value
    .split(' ')
    .filter((_, i) => i <= column)
    .join(' ')
  const selectionIndex = element.value.indexOf(line) + line.length
  element.setSelectionRange(selectionIndex, selectionIndex)
}

const determineDropdownPosition = (isMd: boolean) => {
  const result: { x?: number; y?: number } = { x: 0, y: isMd ? 30 : -260 }
  return result
}

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
  const caretIndexRef = useRef(0)
  const [isFocused, setIsFocused] = useState(false)
  const [dropdownMode, setDropdownMode] = useState<DropdownMode | null>(null)
  const { width, breakpointPxs } = useMediaQuery()
  const {
    updateIngredient,
    updateIngredientAmount,
    updateIngredientMeasurementUnit,
  } = useRecipeStore((state) => ({
    updateIngredient: state.updateIngredient,
    updateIngredientAmount: state.updateIngredientAmount,
    updateIngredientMeasurementUnit: state.updateIngredientMeasurementUnit,
  }))
  const currentIngredientString = parseIngredientString(props.value)

  useImperativeHandle(ref, () => ({
    getElement: () => textareaRef.current,
    getValue: () => textareaRef.current?.value,
    getSelectionStart: () => textareaRef.current?.selectionStart,
    focus: () => textareaRef.current?.focus(),
    setSelectionRange: (start, end, direction) =>
      textareaRef.current?.setSelectionRange(start, end, direction),
  }))

  useLayoutEffect(() => {
    if (textareaRef.current && document.activeElement === textareaRef.current) {
      textareaRef.current.setSelectionRange(
        caretIndexRef.current,
        caretIndexRef.current,
      )
    }
  })

  const xAndY = determineDropdownPosition(width >= breakpointPxs.md)

  const handleOnModeChange = (mode: DropdownMode) => {
    if (textareaRef.current) {
      setCaretColumn(
        textareaRef.current,
        dropDownModes.findIndex((m) => m === mode),
      )
    }
    setDropdownMode(mode)
  }

  const handleAmountOnChange = (value: string, newCaretIndex: number): void => {
    caretIndexRef.current = newCaretIndex
    updateIngredientAmount(props.ingredientId, value)
  }

  const handleMeasurementOnChange = (value: MeasurementUnitType): void => {
    updateIngredientMeasurementUnit(props.ingredientId, value)
  }

  const handleNameSelect = (name: string): void => {
    updateIngredient(
      props.ingredientId,
      ingredientDisplayString({
        ...currentIngredientString,
        name: { ...currentIngredientString.name, value: name, display: name },
      }),
    )
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
    const value = event.currentTarget.value
    switch (inputType) {
      case 'insertText':
        _handleShowDropdown(value)
        updateIngredient(props.ingredientId, value)
        break
      case 'insertFromPaste':
        props.onPaste(props.ingredientId, value)
        break
      case 'deleteContentBackward':
        _handleShowDropdown(value)
        updateIngredient(props.ingredientId, value)
        break
      default:
        console.log(`Unsupported input type: ${inputType}`)
    }
  }

  const _determineDropdownMode = (): DropdownMode | null => {
    if (!textareaRef.current) return null
    const position = getCaretPosition(textareaRef.current)
    const items = props.value.split(' ')
    const hasFraction = fractionRegex.test(items[1] || '')
    if (position.column === 0) return 'amount'
    if (position.column === 1) {
      return hasFraction ? 'amount' : 'measurement'
    }
    if (position.column === 2 && hasFraction) {
      return 'measurement'
    }
    if (position.column >= 2) {
      return 'name'
    }
    return null
  }

  const _handleShowDropdown = (value: string) => {
    const parsed = parseIngredientString(value)
    if (!hasIngredientErrors(parsed)) {
      setDropdownMode(_determineDropdownMode())
    }
  }

  const handleFocused = (): void => {
    setIsFocused(true)
    caretIndexRef.current =
      textareaRef.current?.selectionStart ?? props.value.length
    setDropdownMode(_determineDropdownMode())
  }

  return (
    <>
      <div className="relative flex bg-[var(--bg-current)]">
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
          onBlur={() => {
            if (dropdownMode === null) {
              setIsFocused(false)
            }
          }}
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

        {dropdownMode ? (
          <IngredientDropdown
            mode={dropdownMode}
            amountValue={currentIngredientString.amount.display}
            nameValue={currentIngredientString.name.display.trim()}
            caretIndex={caretIndexRef.current}
            top={xAndY.y}
            left={xAndY.x}
            onBlur={() => setIsFocused(false)}
            onAmountChange={handleAmountOnChange}
            onMeasurementChange={handleMeasurementOnChange}
            onNameClick={handleNameSelect}
            onModeChange={handleOnModeChange}
            className={mergeCss(
              'transition-transform duration-300 ease-in scale-y-0',
              {
                'scale-y-100': isFocused,
              },
            )}
            style={{
              transformOrigin: width < breakpointPxs.md ? 'bottom' : 'top',
            }}
          />
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
