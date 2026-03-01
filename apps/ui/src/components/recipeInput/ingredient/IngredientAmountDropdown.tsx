'use client'

import { mergeCss } from '@repo/design-system'
import { useIngredientRow } from './IngredientRowProvider'

const FRACTION_PRESETS = ['1/2', '1/3', '2/3', '1/4', '3/4', '1/8'] as const

export const IngredientAmountDropdown = () => {
  const { ingredient, onAmountChange } = useIngredientRow()
  const amountDisplay = ingredient.amount.display

  const hasDecimal = amountDisplay.includes('.')
  const spaceIndex = amountDisplay.indexOf(' ')
  const hasFraction = amountDisplay.includes('/')
  const hasWhole = spaceIndex !== -1
  const wholePart = hasWhole ? amountDisplay.slice(0, spaceIndex) : ''
  const fractionPart = hasWhole
    ? amountDisplay.slice(spaceIndex + 1)
    : hasFraction
      ? amountDisplay
      : ''

  const handleFractionPreset = (fraction: string) => {
    if (fractionPart === fraction) {
      const newDisplay = wholePart ? `${wholePart} ` : ''
      onAmountChange(newDisplay, newDisplay.length)
      return
    }
    const newDisplay = wholePart ? `${wholePart} ${fraction}` : fraction
    onAmountChange(newDisplay, newDisplay.length)
  }

  const handleReset = () => {
    onAmountChange('', 0)
  }

  return (
    <div className="grid grid-cols-3 gap-[2px] bg-text p-[2px] w-full">
      {FRACTION_PRESETS.map((fraction) => {
        const isActive = fractionPart === fraction
        return (
          <button
            key={fraction}
            aria-label={fraction}
            aria-pressed={isActive}
            type="button"
            disabled={hasDecimal}
            className={mergeCss(
              'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
              {
                'bg-background text-text font-semibold': isActive,
                'text-text/25': hasDecimal,
              },
            )}
            onClick={() => handleFractionPreset(fraction)}
          >
            {fraction}
          </button>
        )
      })}
      <button
        aria-label="reset amount"
        type="button"
        className="col-span-3 bg-text text-background h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  )
}
