import { type IngredientDto } from '@repo/recipes-codegen/model'
import { useRecipe } from '@src/providers/recipe-provider'
import { ingredientsListSchema } from '@src/zod-schemas'
import { useRef, useState } from 'react'
import { type ZodError } from 'zod/v4'
import { IngredientsMeasurementPopUp } from './IngredientsMeasurementPopup'

interface IngredientsTextAreaProps {
  id: string
  onTextChangeError: (_id: string, _error: ZodError<IngredientDto[]>) => void
}
export const IngredientsTextArea = (props: IngredientsTextAreaProps) => {
  const [inputValue, setInputValue] = useState('')
  const { setIngredients } = useRecipe()
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
    const lines = event.target.value.split('\n')
    //const p = getCaretPosition()
    //const currentRowText = lines[p.row!].split(' ')
    //const result = ingredientRowArraySchema.safeParse(currentRowText)
    const result = ingredientsListSchema.safeParse(
      lines.map((l) => l.split(' ')),
    )
    if (result.success) {
      setIngredients(props.id, result.data)
    } else {
      console.log(result.error)
      props.onTextChangeError(props.id, result.error)
    }
    // const currentCaretLine = lines.slice(0, event.target.value.substring(0, caretPosition).split('\n').length - 1).join('\n');
    // console.log({caretPosition, total: event.target.textLength, currentCaretLine, lines, value: event.target.value});

    // const textarea = inputRef.current;
    //   const cursorPosition = textarea!.selectionStart;
    //   const textBeforeCursor = textarea!.value.substring(0, cursorPosition);
    //   const caretRow = textBeforeCursor.split('\n').length;
    //   console.log({caretRow})
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
          x: rect.x - 150,
          y: rect.y,
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
