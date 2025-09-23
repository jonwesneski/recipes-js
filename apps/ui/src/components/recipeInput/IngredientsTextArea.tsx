'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import { useRecipeStepIngredientsStore } from '@src/providers/recipe-store-provider'
import { IngredientValidator } from '@src/utils/ingredientsValidator'
import React, { useRef, type RefObject } from 'react'
import { IngredientRow } from './IngredientRow'

const placeholder = `0.5 cups fresh basil
1 1/4 cups peanuts
3 whole eggs
1 pinch salt`
const placeholderSplit = placeholder.split('\n')

interface IngredientsTextAreaProps {
  ref?: RefObject<HTMLDivElement | null>
  className?: ClassValue
  onResize: (_height: number) => void
}
export const IngredientsTextArea = (props: IngredientsTextAreaProps) => {
  let textAreaRef = useRef<HTMLDivElement>(null)
  textAreaRef = props.ref ?? textAreaRef
  const {
    ingredients,
    addIngredient,
    removeIngredient,
    updateIngredient,
    insertIngredientsSteps,
  } = useRecipeStepIngredientsStore(textAreaRef)

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
        row?.value.length ?? 0,
        ref.current?.selectionStart ?? 0,
      )

      // This is not working for some reason; but should
      row?.setSelectionRange(rangeValue, rangeValue)
    }
  }

  const handleArrowDown = (
    ref: React.RefObject<HTMLTextAreaElement | null>,
  ) => {
    const index = ingredients?.items.findIndex((item) => item.ref === ref)
    if (index !== undefined && index < (ingredients?.items.length ?? 0) - 1) {
      const row = ingredients?.items[index + 1].ref.current
      row?.focus()
      const rangeValue = Math.min(
        row?.value.length ?? 0,
        ref.current?.selectionStart ?? 0,
      )

      row?.setSelectionRange(rangeValue, rangeValue)
    }
  }

  const handleFocus = () => {
    for (const item of ingredients?.items ?? []) {
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
      className={mergeCss(
        'focus-within:bg-input-focus-background min-h-32 shadow-[-4px_-4px] border p-2 cursor-text',
        props.className,
      )}
      role="textbox"
      onClick={handleFocus}
      tabIndex={0}
      onKeyDown={() => undefined}
    >
      {ingredients?.items.map((item, i) => (
        <IngredientRow
          key={item.keyId}
          ref={item.ref}
          placeholder={placeholderSplit[i]}
          value={item.ingredient.stringValue}
          error={
            item.ingredient.error?.fieldErrors.amount?.[0] ??
            item.ingredient.error?.fieldErrors.name?.[0]
          }
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
