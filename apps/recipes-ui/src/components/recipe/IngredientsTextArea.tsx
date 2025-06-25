'use client'

import { TextArea } from '@repo/ui'
import { IngredientsValidator } from '@src/utils/ingredientsValidator'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

interface IngredientsTextAreaProps {
  ref?: RefObject<HTMLTextAreaElement | null>
  ingredients: string
  onTextChange: (_ingredients: IngredientsValidator) => void
  onPaste: (_data: IngredientsValidator[]) => void
  onResize: (_height: number) => void
}
export const IngredientsTextArea = (props: IngredientsTextAreaProps) => {
  const [inputValue, setInputValue] = useState(props.ingredients)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  let textAreaRef = useRef<HTMLTextAreaElement>(null)
  textAreaRef = props.ref ?? textAreaRef

  useEffect(() => {
    if (props.ref?.current) {
      props.ref.current.focus()
      props.ref.current.setSelectionRange(
        props.ref.current.value.length,
        props.ref.current.value.length,
      )
    }
  }, [])

  const getCaretPosition = () => {
    const position: { row: number; column: number } = {
      row: 0,
      column: 0,
    }

    if (textAreaRef.current) {
      // Calcuate row position
      // // do we care about row position?
      const textarea = textAreaRef.current
      const cursorPosition = textarea.selectionStart
      const textBeforeCursor = textarea.value.substring(0, cursorPosition)
      const row = textBeforeCursor.split('\n').length

      // Calculate column position we have 3 columns in textarea
      const currentRowText = textBeforeCursor.split('\n')[row - 1] || ''
      const column = currentRowText.split(' ').length

      position.row = row - 1
      position.column = column - 1
    }

    return position
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onTextChange(
      new IngredientsValidator({ stringValue: event.target.value }),
    )
    setInputValue(event.target.value)
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
      const position = getCaretPosition()
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
    // Set input for first, pass the rest to be populated later
    setInputValue(data[0])
    props.onTextChange(new IngredientsValidator({ stringValue: data[0] }))
    props.onPaste(
      data.slice(1).map((d) => new IngredientsValidator({ stringValue: d })),
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

  return (
    <>
      <TextArea
        value={inputValue}
        onChange={handleInputChange}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onBlur={handleBlur}
        onPaste={handleOnPaste}
        onInput={handleOnInput}
        onResize={props.onResize}
        ref={textAreaRef}
      />
      {isPopupVisible && (
        <IngredientsMeasurementPopUp
          top={popupPosition.y}
          left={popupPosition.x}
        />
      )}
    </>
  )
}
