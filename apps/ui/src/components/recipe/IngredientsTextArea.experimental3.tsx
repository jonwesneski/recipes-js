/* eslint-disable -- experimental */
'use client'

import { useRecipeStepIngredientsStore } from '@src/providers/recipe-store-provider'
import { IngredientValidator } from '@src/utils/ingredientsValidator'
import React, { RefObject, useRef, useState } from 'react'
import { IngredientRow } from './IngredientRow'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

type InputsType = {
  content: string
  error?: string
  ref: React.RefObject<HTMLInputElement | null>
  focusOnMount: boolean
}

interface IngredientsTextAreaProps {
  ref?: RefObject<HTMLDivElement | null>
  onResize: (_height: number) => void
}
export const IngredientsTextArea3 = (props: IngredientsTextAreaProps) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  let textAreaRef = useRef<HTMLDivElement>(null)
  textAreaRef = props.ref ?? textAreaRef
  const { ingredients, addIngredient, addIngredientItem } =
    useRecipeStepIngredientsStore(textAreaRef)
  const [content, setContent] = useState<InputsType[]>([
    { content: '', ref: useRef<HTMLInputElement>(null), focusOnMount: true },
  ])

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
    ref: React.RefObject<HTMLInputElement | null>,
    ingredient: IngredientValidator,
  ) => {
    // todo make a method that updates 1 ingredient row
    console.log(ingredient)
    addIngredientItem(ref, ingredient)
    // setContent((prev) => {
    //   const index = prev.findIndex((item) => item.ref === ref)
    //   if (index !== -1) {
    //     const newContent = [...prev]
    //     newContent[index] = {
    //       ...newContent[index],
    //       content: ingredient.stringValue,
    //       error: ingredient.error?.issues[0].message,
    //     }
    //     return newContent
    //   }
    //   return prev
    // })
  }

  const handleNewRow = (ref: React.RefObject<HTMLInputElement | null>) => {
    console.log('handleNewRow', ref)
    addIngredient(ref)
    // setContent((prev) => {
    //   const index = prev.findIndex((item) => item.ref === ref)
    //   if (index === -1) {
    //     return prev
    //   }
    //   for (let i = index + 1; i < prev.length; i++) {
    //     prev[i].focusOnMount = false
    //   }
    //   return [
    //     ...prev.slice(0, index + 1),
    //     { content: '', ref: createRef<HTMLInputElement>(), focusOnMount: true },
    //     ...prev.slice(index + 1),
    //   ]
    // })
  }

  const handleRemove = (ref: React.RefObject<HTMLInputElement | null>) => {
    setContent((prev) => {
      const index = prev.findIndex((item) => item.ref === ref)
      if (index === -1 || prev.length <= 1) {
        return prev
      }
      return prev.toSpliced(index, 1)
    })
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
      className="focus-within:bg-input-focus-background"
      onClick={handleFocus}
    >
      {ingredients?.items.map((item, index) => (
        <React.Fragment key={index}>
          <IngredientRow
            ref={item.ref}
            value={item.ingredient.stringValue}
            error={item.ingredient.error?.issues[0].message}
            focusOnMount={item.shouldIngredientBeFocused}
            onChange={handleChange}
            onEnterPressed={handleNewRow}
            onRemove={handleRemove}
          />
        </React.Fragment>
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
