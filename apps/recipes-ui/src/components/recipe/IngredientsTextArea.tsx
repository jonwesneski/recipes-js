'use client'

import { IngredientsValidator } from '@src/utils/ingredientsValidator'
import { useRef, useState } from 'react'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

interface IngredientsTextAreaProps {
  ingredients: string
  onTextChange: (_ingredients: IngredientsValidator) => void
  onPaste: (_data: IngredientsValidator[]) => void
  onResize: (_height: number) => void
}
export const IngredientsTextArea = (props: IngredientsTextAreaProps) => {
  const [inputValue, setInputValue] = useState(props.ingredients)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const getCaretPosition = () => {
    const position: { row: number; column: number } = {
      row: 0,
      column: 0,
    }

    if (inputRef.current) {
      // Calcuate row position
      // // do we care about row position?
      const textarea = inputRef.current
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
    //setInputValue(event.target.value)
    handleResize()
  }

  const handleMouseUp = (_event: React.MouseEvent<HTMLTextAreaElement>) => {
    _handleShowPopUp()
  }

  const handleTouchEnd = (_event: React.TouchEvent<HTMLTextAreaElement>) => {
    _handleShowPopUp()
  }

  const _handleShowPopUp = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
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

  const handleResize = () => {
    if (
      inputRef.current &&
      inputRef.current.clientHeight < inputRef.current.scrollHeight
    ) {
      inputRef.current.style.overflow = 'hidden'
      props.onResize(inputRef.current.scrollHeight)
    }
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

    const obj: { [x in string]: any } = {}
    for (const key in descriptors) {
      if (descriptors[key].get) {
        obj[key] = event.nativeEvent[key as never]
        obj[`${key}TYPE`] = typeof event.nativeEvent[key as never]
      }
    }
    // console.log(
    //   JSON.stringify({
    //     ...obj,
    //     ISINSERT: event.nativeEvent.inputType === 'insertText',
    //     INSERTDATA: event.nativeEvent.data,
    //   }),
    // )
    setInputValue(
      JSON.stringify({
        ...obj,
        ISINSERT: event.nativeEvent.inputType === 'insertText',
        INSERTDATA: event.nativeEvent.data,
      }),
    )
    if (
      event.nativeEvent.inputType === 'insertText' &&
      event.nativeEvent.data &&
      event.nativeEvent.data.length > 1
    ) {
      // This might have been pasted from some mobile phones like
      // android keyboard (which doesn't fire onPaste) so calling it
      // explicitly here
      event.preventDefault()
      handleOnPaste({
        clipboardData: {
          getData: (_format: string) => event.nativeEvent.data,
        },
      } as React.ClipboardEvent<HTMLTextAreaElement>)
    }
  }

  return (
    <>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onBlur={handleBlur}
        onPaste={handleOnPaste}
        onInput={handleOnInput}
        ref={inputRef}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          resize: 'none',
          height: '100%',
        }}
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
