'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import { useMediaQuery } from '@src/hooks'
import { useRecipeStepIngredientsStore } from '@src/providers/recipe-store-provider'
import { type MeasurementUnitType } from '@src/utils/measurements'
import { fractionRegex } from '@src/zod-schemas'
import { useRef, useState } from 'react'
import { IngredientRow, type IngredientRowHandle } from './IngredientRow'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

const placeholder = `0.5 cups fresh basil
1 1/4 cups peanuts
3 eggs
1 ounce salt`
const placeholderSplit = placeholder.split('\n')

// TODO: rework file into a web component
interface IngredientsTextAreaProps {
  stepId: string
  stepNumber: number
  className?: ClassValue
  onResize: (_height: number) => void
}
export const IngredientsTextArea = (props: IngredientsTextAreaProps) => {
  const textAreaRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, IngredientRowHandle>>(new Map())
  const [keyIdMeasurementPopup, setKeyIdMeasurementPopup] = useState<
    string | null
  >(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const { width, breakpointPxs } = useMediaQuery()
  const {
    ingredients,
    ingredientIds,
    addIngredient,
    removeIngredient,
    updateIngredient,
    insertIngredientsSteps,
  } = useRecipeStepIngredientsStore(props.stepId)

  const handleMeasurementInPopupClick = (value: MeasurementUnitType): void => {
    // if (!ingredients) {
    //   return
    // }

    const index = ingredientIds.findIndex((id) => id === keyIdMeasurementPopup)
    const text = itemRefs.current.get(ingredientIds[index])?.getValue()
    if (!text) {
      return
    }

    const items = text.split(' ')
    if (fractionRegex.test(items[1])) {
      items[2] = value
    } else {
      items[1] = value
    }

    if (keyIdMeasurementPopup) {
      updateIngredient(keyIdMeasurementPopup, items.join(' '))
    }
    setKeyIdMeasurementPopup(null)
  }

  const handleChange = (keyId: string, ingredient: string) => {
    updateIngredient(keyId, ingredient)
  }

  const handleMeasurementInput = (
    ingredientId: string | null,
    element: HTMLTextAreaElement | null,
  ) => {
    const rowIndex = ingredientIds.findIndex((id) => id === ingredientId)
    if (ingredientId && element && rowIndex >= 0) {
      let yOffset = NaN
      if (width >= breakpointPxs.md) {
        const yMultipler = rowIndex * 10
        yOffset = 40 + yMultipler
      } else {
        const yMultipler = rowIndex * 25
        yOffset = -170 + yMultipler
      }
      const rect = element.getBoundingClientRect()
      setPopupPosition({
        x: rect.x,
        y: yOffset,
      })
    }
    setKeyIdMeasurementPopup(ingredientId)
  }

  const handleNewRow = (ingredientId: string) => {
    addIngredient(ingredientId)
  }

  const handleRemove = (ingredientId: string) => {
    handleArrowUp(ingredientId)
    removeIngredient(props.stepId, ingredientId)
  }

  const handleArrowUp = (ingredientId: string) => {
    // if (!ingredients) {
    //   return
    // }
    const index = ingredientIds.findIndex((id) => id === ingredientId)
    if (index > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it won't be null
      const row = itemRefs.current.get(ingredientIds[index - 1])!
      row.focus()
      const rangeValue = Math.min(
        row.getValue()?.length ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it won't be null
        itemRefs.current.get(ingredientId)!.getSelectionStart() ?? 0,
      )

      // This is not working for some reason; but should
      row.setSelectionRange(rangeValue, rangeValue)
    }
  }

  const handleArrowDown = (ingredientId: string) => {
    // if (!ingredients) {
    //   return
    // }
    const index = ingredientIds.findIndex((id) => id === ingredientId)
    if (index < ingredientIds.length - 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it won't be null
      const row = itemRefs.current.get(ingredientIds[index + 1])!
      row.focus()
      const rangeValue = Math.min(
        row.getValue()?.length ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it won't be null
        itemRefs.current.get(ingredientId)!.getSelectionStart() ?? 0,
      )

      row.setSelectionRange(rangeValue, rangeValue)
    }
  }

  const handleFocus = () => {
    for (const item of itemRefs.current.values()) {
      if (document.activeElement === item.getElement()) {
        return
      }
    }
    const lastItem = [...itemRefs.current.values()].at(-1)
    lastItem?.focus()
  }

  /* When some pastes in recipes that are already separated by linebreaks
   * we will add new steps for them
   */
  const handleOnPaste = (ingredientId: string, value: string) => {
    const dataListofList = value.includes('\r')
      ? value.split('\r\n\r\n').map((v) => v.split('\r\n'))
      : value.split('\n\n').map((v) => v.split('\n'))
    insertIngredientsSteps(props.stepId, ingredientId, dataListofList)
  }

  return (
    <div
      ref={textAreaRef}
      data-testid="ingredients-text-area"
      className={mergeCss(
        'relative focus-within:bg-input-focus-background focus-within:[--bg-current:theme(colors.input-focus-background)] [--bg-current:theme(colors.background)] min-h-32 w-full border-2 pl-2 pr-2 pb-2 pt-4 cursor-text',
        props.className,
      )}
      role="textbox"
      onClick={handleFocus}
      tabIndex={0}
      onKeyDown={() => undefined}
    >
      {ingredientIds.map((id, i) => (
        <IngredientRow
          key={id}
          ingredientId={id}
          htmlFor={`step ${props.stepNumber} ingredients`}
          label={i === 0 ? 'ingredients' : undefined}
          ref={(element) => {
            if (element) {
              itemRefs.current.set(id, element)
            } else {
              itemRefs.current.delete(id)
            }
          }}
          placeholder={placeholderSplit[i]}
          value={ingredients[id].stringValue ?? ''}
          error={
            ingredients[id].error?.fieldErrors.amount?.[0] ??
            ingredients[id].error?.fieldErrors.name?.[0]
          }
          // focusOnMount move this logic to step list component pass ref in callback?
          onChange={handleChange}
          onMeasurementInput={handleMeasurementInput}
          onPaste={handleOnPaste}
          onEnterPressed={handleNewRow}
          onRemove={handleRemove}
          onArrowDown={handleArrowDown}
          onArrowUp={handleArrowUp}
        />
      ))}
      <IngredientsMeasurementPopUp
        top={popupPosition.y}
        left={popupPosition.x}
        onClick={handleMeasurementInPopupClick}
        onBlur={() => setKeyIdMeasurementPopup(null)}
        className={mergeCss('transition-transform duration-300 ease-in', {
          'scale-y-100': keyIdMeasurementPopup,
          'scale-y-0': !keyIdMeasurementPopup,
        })}
        style={{
          transformOrigin: width < breakpointPxs.md ? 'bottom' : 'top',
        }}
      />
    </div>
  )
}
