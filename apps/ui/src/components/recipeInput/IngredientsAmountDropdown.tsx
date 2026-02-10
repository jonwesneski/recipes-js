'use client'

import { mergeCss } from '@repo/design-system'
import { useState } from 'react'

interface IngredientsAmountDropdownProps {
  value: string
  onChange: (_value: string) => void
}
export const IngredientsAmountDropdown = (
  props: IngredientsAmountDropdownProps,
) => {
  const [values, setValues] = useState<string[]>(props.value.split(''))
  const spaceIndex = values.findIndex((v) => v === ' ')
  const decimalIndex = values.findIndex((v) => v === '.')
  const fractionIndex = values.findIndex((v) => v === '/')
  const hasSpace = spaceIndex !== -1
  const hasDecimal = decimalIndex !== -1
  const hasFraction = fractionIndex !== -1
  const isWhole = !hasDecimal && !hasFraction
  const startsWithNonZero = Boolean(Number(values[0]))
  const enableDenominatorZero =
    hasDecimal || (hasFraction && Boolean(values[fractionIndex + 1]))

  const handleOnNumber = (value: number) => {
    setValues((prev) => {
      prev.push(value.toString())
      props.onChange(prev.join(''))
      return [...prev]
    })
  }

  const handleOnSpace = () => {
    if (!hasSpace && !hasDecimal && !hasFraction) {
      setValues((prev) => [...prev, ' '])
    }
  }

  const handleOnDecimal = () => {
    if (!hasDecimal && !hasFraction) {
      setValues((prev) => [...prev, '.'])
    }
  }

  const handleOnFraction = () => {
    if (!hasFraction && !hasDecimal) {
      setValues((prev) => [...prev, '/'])
    }
  }

  return (
    <div className="inline-grid grid-cols-6 gap-[2px] bg-text p-[2px]">
      {/* Row 1 */}
      <button
        aria-label="1"
        type="button"
        className="w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber(1)}
      >
        1
      </button>
      <button
        aria-label="3"
        type="button"
        className="w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber(3)}
      >
        3
      </button>
      <button
        aria-label="6"
        type="button"
        className="w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber(6)}
      >
        6
      </button>
      <button
        aria-label="0"
        type="button"
        disabled={!startsWithNonZero}
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': !startsWithNonZero },
        )}
        onClick={() => handleOnNumber(0)}
      >
        0
      </button>
      <button
        aria-label="backspace"
        type="button"
        className={mergeCss(
          'bg-text text-background w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'bg-text/50 text-background/75': !startsWithNonZero },
        )}
        onClick={() =>
          setValues((prev) => {
            prev.pop()
            return [...prev]
          })
        }
      >
        ⌫
      </button>
      <button
        aria-label="4 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(4)}
      >
        4
      </button>

      {/* Row 2 */}
      <button
        aria-label="2"
        type="button"
        className="w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber(4)}
      >
        2
      </button>
      <button
        aria-label="5"
        type="button"
        className="w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber(5)}
      >
        5
      </button>
      <button
        aria-label="9"
        type="button"
        className="w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber(9)}
      >
        9
      </button>
      <button
        aria-label="space"
        type="button"
        className={mergeCss(
          'bg-text text-background w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'bg-text/50 text-background/75': !startsWithNonZero },
        )}
        onClick={handleOnSpace}
      >
        ␣
      </button>
      <button
        aria-label="3 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(3)}
      >
        3
      </button>
      <button
        aria-label="7 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(7)}
      >
        7
      </button>

      {/* Row 3 */}
      <button
        aria-label="4"
        type="button"
        className="w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber(4)}
      >
        4
      </button>
      <button
        aria-label="8"
        type="button"
        className="w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber(8)}
      >
        8
      </button>
      <button
        aria-label="decimal"
        disabled={hasFraction}
        type="button"
        className={mergeCss(
          'bg-text text-background w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'bg-text/50 text-background/75': !startsWithNonZero },
        )}
        onClick={handleOnDecimal}
      >
        .
      </button>
      <button
        aria-label="2 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(2)}
      >
        2
      </button>
      <button
        aria-label="6 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(6)}
      >
        6
      </button>
      <button
        aria-label="6 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(9)}
      >
        9
      </button>

      {/* Row 4 */}
      <button
        aria-label="7"
        type="button"
        className="w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber(7)}
      >
        7
      </button>

      <button
        aria-label="fraction"
        disabled={hasDecimal}
        type="button"
        className={mergeCss(
          'bg-text text-background w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'bg-text/50 text-background/75': !startsWithNonZero },
        )}
        onClick={handleOnFraction}
      >
        /
      </button>
      <button
        aria-label="1-denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(1)}
      >
        1
      </button>
      <button
        aria-label="5 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(5)}
      >
        5
      </button>
      <button
        aria-label="8 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(8)}
      >
        8
      </button>
      <button
        aria-label="0 denomitator"
        disabled={!enableDenominatorZero}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': !enableDenominatorZero },
        )}
        onClick={() => handleOnNumber(0)}
      >
        0
      </button>
    </div>
  )
}
