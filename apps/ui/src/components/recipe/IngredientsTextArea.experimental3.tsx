/* eslint-disable -- experimental */
'use client'

import { useRecipeStepIngredientsStore } from '@src/providers/recipe-store-provider'
import { IngredientValidator } from '@src/utils/ingredientsValidator'
import React, { RefObject, useRef, useState } from 'react'
import { IngredientRow } from './IngredientRow'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

interface IngredientsTextAreaProps {
  ref?: RefObject<HTMLDivElement | null>
  onResize: (_height: number) => void
}
export const IngredientsTextArea3 = (props: IngredientsTextAreaProps) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  let textAreaRef = useRef<HTMLDivElement>(null)
  textAreaRef = props.ref ?? textAreaRef
  const {
    ingredients,
    addIngredient,
    removeIngredient,
    updateIngredient,
    insertIngredientsSteps,
  } = useRecipeStepIngredientsStore(textAreaRef)

  const getCaretPosition = (element: HTMLInputElement) => {
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

  const handleChange = (
    ref: React.RefObject<HTMLTextAreaElement | null>,
    ingredient: IngredientValidator,
  ) => {
    updateIngredient(ref, ingredient)
  }

  const handleNewRow = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
    addIngredient(ref)
  }

  const handleRemove = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
    removeIngredient(ref)
  }

  const handleArrowUp = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
    const index = ingredients?.items.findIndex((item) => item.ref === ref)
    if (index && index > 0) {
      ingredients?.items[index - 1].ref.current?.focus()
    }
  }

  const handleArrowDown = (
    ref: React.RefObject<HTMLTextAreaElement | null>,
  ) => {
    const index = ingredients?.items.findIndex((item) => item.ref === ref)
    if (index !== undefined && index < (ingredients?.items.length || 0) - 1) {
      ingredients?.items[index + 1].ref.current?.focus()
    }
  }

  const handleFocus = () => {
    for (const item of ingredients?.items || []) {
      if (document.activeElement === item.ref.current) {
        return
      }
    }
    if (ingredients?.items.length) {
      ingredients.items[ingredients.items.length - 1].ref.current?.focus()
    }
  }

  /* When some pastes in recipes that are already separated by linebreaks
   * we will add new steps for them
   */
  const handleOnPaste = (
    ref: React.RefObject<HTMLTextAreaElement | null>,
    value: string,
  ) => {
    const dataListofList = value.includes('\r')
      ? value.split('\r\n\r\n').map((v) => v.split('\r\n'))
      : value.split('\n\n').map((v) => v.split('\n'))
    insertIngredientsSteps(
      ref,
      dataListofList.map((dl) =>
        dl.map((d) => new IngredientValidator({ stringValue: d })),
      ),
    )
  }

  const _handleShowPopUp = (row: HTMLInputElement) => {
    const rect = row.getBoundingClientRect()
    const position = getCaretPosition(row)
    // is caret in measurement-unit column
    if (position.column === 1) {
      const x = rect.width / 6
      const y = position.row + 1
      const yMultipler = y * 10
      setPopupPosition({
        x: rect.x - x,
        y: rect.y + yMultipler + 50,
      })
      setIsPopupVisible(true)
    } else {
      setIsPopupVisible(false)
    }
  }

  return (
    <div
      ref={textAreaRef}
      data-testid="ingredients-text-area"
      className="focus-within:bg-input-focus-background"
      onClick={handleFocus}
    >
      {ingredients?.items.map((item) => (
        <IngredientRow
          key={item.keyId}
          ref={item.ref}
          value={item.ingredient.stringValue}
          error={item.ingredient.error?.issues[0].message}
          focusOnMount={item.shouldBeFocused}
          onChange={handleChange}
          onPaste={handleOnPaste}
          onEnterPressed={handleNewRow}
          onRemove={handleRemove}
          onArrowDown={handleArrowDown}
          onArrowUp={handleArrowUp}
        />
      ))}
      {isPopupVisible ? (
        <IngredientsMeasurementPopUp
          top={popupPosition.y}
          left={popupPosition.x}
        />
      ) : null}
    </div>
  )
}
