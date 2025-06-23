'use client'

import { IngredientsValidator } from '@src/utils/ingredientsValidator'
import { useRef, useState } from 'react'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

interface IngredientsTextAreaProps {
  ingredients: string
  onTextChange: (_ingredients: IngredientsValidator) => void
  //onTextChangeError: (_error: ZodError<IngredientDto[]>) => void
  onPaste: (_data: IngredientsValidator[]) => void
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
    setInputValue(event.target.value)
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
      if (isCaretOnMeasurementColumn()) {
        setPopupPosition({
          x: rect.left - rect.width * 2,
          y: rect.height - 5,
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
    const data = event.clipboardData.getData('text/plain').split('\r\n\r\n')
    // Set input for first, pass the rest to be populated later
    setInputValue(data[0])
    props.onTextChange(new IngredientsValidator({ stringValue: data[0] }))
    props.onPaste(
      data.slice(1).map((d) => new IngredientsValidator({ stringValue: d })),
    )
  }

  const isCaretOnMeasurementColumn = () => {
    const position = getCaretPosition()
    return position.column === 1
  }

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onBlur={handleBlur}
        onPaste={handleOnPaste}
        ref={inputRef}
        style={{ padding: '10px', border: '1px solid #ccc' }}
      />
      {isPopupVisible && (
        <IngredientsMeasurementPopUp
          top={popupPosition.y}
          left={popupPosition.x}
        />
      )}
    </div>
  )
}
