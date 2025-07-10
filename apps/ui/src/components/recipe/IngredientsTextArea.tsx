'use client'

import { TextArea } from '@repo/design-system'
import { useRecipeStepIngredientsStore } from '@src/providers/recipe-store-provider'
import { IngredientsValidator } from '@src/utils/ingredientsValidator'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

const placeholder = `0.5 cups fresh basil
1 1/4 cups peanuts
3 whole eggs
1 pinch salt`

interface IngredientsTextAreaProps {
  ref?: RefObject<HTMLTextAreaElement | null>
  onResize: (_height: number) => void
}
export const IngredientsTextArea = (props: IngredientsTextAreaProps) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  let textAreaRef = useRef<HTMLTextAreaElement>(null)
  textAreaRef = props.ref ?? textAreaRef
  const {
    ingredients,
    setIngredients,
    shouldBeFocused,
    insertIngredientsSteps,
  } = useRecipeStepIngredientsStore(textAreaRef)

  useEffect(() => {
    if (textAreaRef.current && shouldBeFocused) {
      // Set Caret Position
      textAreaRef.current.focus()
      textAreaRef.current.setSelectionRange(
        textAreaRef.current.value.length,
        textAreaRef.current.value.length,
      )
    }
  }, [])

  const getCaretPosition = (element: HTMLTextAreaElement) => {
    const position: { row: number; column: number } = {
      row: 0,
      column: 0,
    }

    // Calcuate row position
    // // do we care about row position?
    const cursorPosition = element.selectionStart
    const textBeforeCursor = element.value.substring(0, cursorPosition)
    const row = textBeforeCursor.split('\n').length

    // Calculate column position we have 3 columns in textarea
    const currentRowText = textBeforeCursor.split('\n')[row - 1] || ''
    const column = currentRowText.split(' ').length

    position.row = row - 1
    position.column = column - 1

    return position
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIngredients(
      new IngredientsValidator({ stringValue: event.target.value }),
    )
  }

  const handleMouseUp = (_event: React.MouseEvent<HTMLTextAreaElement>) => {
    _handleShowPopUp()
  }

  const handleTouchEnd = (_event: React.TouchEvent<HTMLTextAreaElement>) => {
    _handleShowPopUp()
  }

  const _handleShowPopUp = () => {
    if (textAreaRef.current) {
      const rect = textAreaRef.current.getBoundingClientRect()
      const position = getCaretPosition(textAreaRef.current)
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
  }

  const handleBlur = () => {
    setIsPopupVisible(false)
  }

  /* When some pastes in recipes that are already separated by '\r\n\r\n'
   * we will add new steps for them
   */
  const handleOnPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    const stringData = event.clipboardData.getData('text/plain')
    const data = stringData.includes('\r')
      ? stringData.split('\r\n\r\n')
      : stringData.split('\n\n')
    insertIngredientsSteps(
      data.map((d) => new IngredientsValidator({ stringValue: d })),
    )
  }

  const handleOnInput = (event: React.InputEvent<HTMLTextAreaElement>) => {
    const descriptors = Object.getOwnPropertyDescriptors(
      Object.getPrototypeOf(event.nativeEvent),
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- f
    const obj: Record<string, any> = {}
    for (const key in descriptors) {
      if (descriptors[key].get) {
        obj[key] = event.nativeEvent[key as never]
        obj[`${key}TYPE`] = typeof event.nativeEvent[key as never]
      }
    }
    console.log(JSON.stringify(obj))
    // console.log(
    //   JSON.stringify({
    //     ...obj,
    //     ISINSERT: event.nativeEvent.inputType === 'insertText',
    //     INSERTDATA: event.nativeEvent.data,
    //   }),
    // )
    if (event.nativeEvent.inputType === 'insertLineBreak') {
      // This might have been pasted from some mobile phones like
      // android keyboard (which doesn't fire onPaste) so calling it
      // explicitly here
      // const end1 = event.currentTarget.textContent?.slice(-4) || ''
      // const end2 = event.currentTarget.textContent?.slice(-2) || ''
      // if (end1 === '\r\n' || end2 === '\n') {
      //   event.preventDefault()
      //   props.onPaste([new IngredientsValidator({ stringValue: '' })])
      // }
      // console.log(
      //   JSON.stringify({ inputValue: event.currentTarget.textContent }),
      // )
    }
  }

  const handleOnResize = (height: number) => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `${height}px`
    }
  }

  return (
    <>
      <TextArea
        ref={textAreaRef}
        className="min-h-32 min-w-80 grow-1"
        value={ingredients?.stringValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onBlur={handleBlur}
        onPaste={handleOnPaste}
        onInput={handleOnInput}
        onResize={handleOnResize}
        data-testid="ingredients-text-area"
      />
      {isPopupVisible ? (
        <IngredientsMeasurementPopUp
          top={popupPosition.y}
          left={popupPosition.x}
        />
      ) : null}
    </>
  )
}
