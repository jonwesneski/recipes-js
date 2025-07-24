/* eslint-disable -- experimental */
'use client'

import { useRecipeStepIngredientsStore } from '@src/providers/recipe-store-provider'
import { IngredientValidator } from '@src/utils/ingredientsValidator'
import React, { RefObject, useRef, useState } from 'react'
import { IngredientRow } from './IngredientRow'

const placeholder = `0.5 cups fresh basil
1 1/4 cups peanuts
3 whole eggs
1 pinch salt`
const placeholderSplit = placeholder.split('\n')

type PositionType = { row: number; column: number }

interface IngredientsTextAreaProps {
  ref?: RefObject<HTMLDivElement | null>
  onResize: (_height: number) => void
}
export const IngredientsTextArea = (props: IngredientsTextAreaProps) => {
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
    handleArrowUp(ref)
    removeIngredient(ref)
  }

  const handleArrowUp = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
    const index = ingredients?.items.findIndex((item) => item.ref === ref)
    if (index && index > 0) {
      const row = ingredients?.items[index - 1].ref.current
      row?.focus()
      const rangeValue = Math.min(
        row?.value.length || 0,
        ref.current?.selectionStart || 0,
      )

      // This is not working for some reason; but should
      row?.setSelectionRange(rangeValue, rangeValue)
    }
  }

  const handleArrowDown = (
    ref: React.RefObject<HTMLTextAreaElement | null>,
  ) => {
    const index = ingredients?.items.findIndex((item) => item.ref === ref)
    if (index !== undefined && index < (ingredients?.items.length || 0) - 1) {
      const row = ingredients?.items[index + 1].ref.current
      row?.focus()
      const rangeValue = Math.min(
        row?.value.length || 0,
        ref.current?.selectionStart || 0,
      )

      row?.setSelectionRange(rangeValue, rangeValue)
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

  return (
    <div
      ref={textAreaRef}
      data-testid="ingredients-text-area"
      className="focus-within:bg-input-focus-background min-h-32 min-w-80 grow-1 shadow-[-4px_-4px] border p-2"
      onClick={handleFocus}
    >
      {ingredients?.items.map((item, i) => (
        <IngredientRow
          key={item.keyId}
          ref={item.ref}
          placeholder={placeholderSplit[i]}
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
    </div>
  )
}
