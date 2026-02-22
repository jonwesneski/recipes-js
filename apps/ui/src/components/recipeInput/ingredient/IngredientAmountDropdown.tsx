'use client'

import { mergeCss } from '@repo/design-system'

interface IngredientAmountDropdownProps {
  value: string
  caretIndex: number
  onChange: (_value: string, _newCaretIndex: number) => void
}
export const IngredientAmountDropdown = (
  props: IngredientAmountDropdownProps,
) => {
  const spaceIndex = props.value.indexOf(' ')
  const decimalIndex = props.value.indexOf('.')
  const fractionIndex = props.value.indexOf('/')
  const hasSpace = spaceIndex !== -1
  const hasDecimal = decimalIndex !== -1
  const hasFraction = fractionIndex !== -1
  const isWhole = !hasDecimal && !hasFraction
  const atLeastOneDigit = !isNaN(Number(props.value[0]))
  const enableDenominatorZero =
    hasDecimal || (hasFraction && Boolean(props.value[fractionIndex + 1]))

  const _addCharacter = (value: string) => {
    props.onChange(
      `${props.value.slice(0, props.caretIndex)}${value}${props.value.slice(props.caretIndex)}`,
      props.caretIndex + 1,
    )
  }

  const _removeCharacter = () => {
    const possibleCaretIndex = props.caretIndex - 1
    props.onChange(
      `${props.value.slice(0, props.caretIndex - 1)}${props.value.slice(props.caretIndex)}`,
      possibleCaretIndex >= 0 ? possibleCaretIndex : 0,
    )
  }

  const handleOnNumber = (value: string) => {
    _addCharacter(value)
  }

  const handleOnSpace = () => {
    if (!hasSpace && !hasDecimal && !hasFraction) {
      _addCharacter(' ')
    }
  }

  const handleOnDecimal = () => {
    if (!hasDecimal && !hasFraction) {
      _addCharacter('.')
    }
  }

  const handleOnFraction = () => {
    if (!hasFraction && !hasDecimal) {
      _addCharacter('/')
    }
  }

  return (
    <div className="grid grid-cols-6 gap-[2px] bg-text p-[2px] w-full">
      {/* Row 1 */}
      <button
        aria-label="1"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('1')}
      >
        1
      </button>
      <button
        aria-label="3"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('3')}
      >
        3
      </button>
      <button
        aria-label="6"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('6')}
      >
        6
      </button>
      <button
        aria-label="0"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('0')}
      >
        0
      </button>
      <button
        aria-label="backspace"
        type="button"
        className={mergeCss(
          'bg-text text-background h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'bg-text/50 text-background/75': !atLeastOneDigit },
        )}
        onClick={_removeCharacter}
      >
        ⌫
      </button>
      <button
        aria-label="4 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber('4')}
      >
        4
      </button>

      {/* Row 2 */}
      <button
        aria-label="2"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('2')}
      >
        2
      </button>
      <button
        aria-label="5"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('5')}
      >
        5
      </button>
      <button
        aria-label="9"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('9')}
      >
        9
      </button>
      <button
        aria-label="space"
        type="button"
        className={mergeCss(
          'bg-text text-background h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'bg-text/50 text-background/75': !atLeastOneDigit },
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
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber('3')}
      >
        3
      </button>
      <button
        aria-label="7 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber('7')}
      >
        7
      </button>

      {/* Row 3 */}
      <button
        aria-label="4"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('4')}
      >
        4
      </button>
      <button
        aria-label="8"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('8')}
      >
        8
      </button>
      <button
        aria-label="decimal"
        disabled={hasFraction}
        type="button"
        className={mergeCss(
          'bg-text text-background h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'bg-text/50 text-background/75': hasFraction },
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
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber('2')}
      >
        2
      </button>
      <button
        aria-label="6 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber('6')}
      >
        6
      </button>
      <button
        aria-label="6 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber('9')}
      >
        9
      </button>

      {/* Row 4 */}
      <button
        aria-label="7"
        type="button"
        className="h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => handleOnNumber('7')}
      >
        7
      </button>

      <button
        aria-label="fraction"
        disabled={hasDecimal}
        type="button"
        className={mergeCss(
          'bg-text text-background h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'bg-text/50 text-background/75': !atLeastOneDigit },
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
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber('1')}
      >
        1
      </button>
      <button
        aria-label="5 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber('5')}
      >
        5
      </button>
      <button
        aria-label="8 denominator"
        disabled={isWhole}
        type="button"
        className={mergeCss(
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': isWhole },
        )}
        onClick={() => handleOnNumber('8')}
      >
        8
      </button>
      <button
        aria-label="0 denomitator"
        disabled={!enableDenominatorZero}
        type="button"
        className={mergeCss(
          'h-12 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
          { 'text-text/25': !enableDenominatorZero },
        )}
        onClick={() => handleOnNumber('0')}
      >
        0
      </button>
    </div>
  )
}
