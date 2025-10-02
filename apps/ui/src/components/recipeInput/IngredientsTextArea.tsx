'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import { useRecipeStepIngredientsStore } from '@src/providers/recipe-store-provider'
import { IngredientValidator } from '@src/utils/ingredientsValidator'
import { useRef, type RefObject } from 'react'
import { IngredientRow, type IngredientRowHandle } from './IngredientRow'

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
  const itemRefs = useRef<Map<string, IngredientRowHandle>>(new Map())
  textAreaRef = props.ref ?? textAreaRef
  const {
    ingredients,
    addIngredient,
    removeIngredient,
    updateIngredient,
    insertIngredientsSteps,
  } = useRecipeStepIngredientsStore(textAreaRef)

  const handleChange = (keyId: string, ingredient: IngredientValidator) => {
    updateIngredient(keyId, ingredient)
  }

  const handleNewRow = (keyId: string) => {
    addIngredient(keyId)
  }

  const handleRemove = (keyId: string) => {
    handleArrowUp(keyId)
    removeIngredient(keyId)
  }

  const handleArrowUp = (keyId: string) => {
    if (!ingredients) {
      return
    }
    const index = ingredients.items.findIndex((item) => item.keyId === keyId)
    if (index > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it won't be null
      const row = itemRefs.current.get(ingredients.items[index - 1].keyId)!
      row.focus()
      const rangeValue = Math.min(
        row.getValue()?.length ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it won't be null
        itemRefs.current.get(keyId)!.getSelectionStart() ?? 0,
      )

      // This is not working for some reason; but should
      row.setSelectionRange(rangeValue, rangeValue)
    }
  }

  const handleArrowDown = (keyId: string) => {
    if (!ingredients) {
      return
    }
    const index = ingredients.items.findIndex((item) => item.keyId === keyId)
    if (index < ingredients.items.length - 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it won't be null
      const row = itemRefs.current.get(ingredients.items[index + 1].keyId)!
      row.focus()
      const rangeValue = Math.min(
        row.getValue()?.length ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it won't be null
        itemRefs.current.get(keyId)!.getSelectionStart() ?? 0,
      )

      row.setSelectionRange(rangeValue, rangeValue)
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
  const handleOnPaste = (keyId: string, value: string) => {
    const dataListofList = value.includes('\r')
      ? value.split('\r\n\r\n').map((v) => v.split('\r\n'))
      : value.split('\n\n').map((v) => v.split('\n'))
    insertIngredientsSteps(
      keyId,
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
          keyId={item.keyId}
          ref={(element) => {
            if (element) {
              itemRefs.current.set(item.keyId, element)
            } else {
              itemRefs.current.delete(item.keyId)
            }
          }}
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
