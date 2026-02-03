'use client'

import { mergeCss } from '@repo/design-system'
import { useState } from 'react'

interface IngredientsAmountPopupProps {
  onChange: (_value: string) => void
}
export const IngredientsAmountPopup = (props: IngredientsAmountPopupProps) => {
  const [values, setValues] = useState<string[]>([])
  const hasDecimal = '.' in values
  const hasFraction = '/' in values
  const isWhole = !hasDecimal && !hasFraction
  const startsWithNonZero = !!Number(values[0])

  const handleOnNumber = (value: number) => {
    setValues((prev) => {
      prev.push(value.toString())
      props.onChange(prev.join(''))
      return [...prev]
    })
  }

  return (
    <div className="inline-grid grid-cols-6 gap-[1px] bg-gray-300 p-[1px]">
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
          { 'text-text/25 bg-text/5': !startsWithNonZero },
        )}
        onClick={() => values.pop()}
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
          { 'text-background/25 bg-text/5': !startsWithNonZero },
        )}
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
          { 'text-background/25 bg-text/5': !startsWithNonZero },
        )}
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
          { 'text-background/25 bg-text/5': !startsWithNonZero },
        )}
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
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'w-12 h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber(0)}
      >
        0
      </button>
    </div>
  )
}
