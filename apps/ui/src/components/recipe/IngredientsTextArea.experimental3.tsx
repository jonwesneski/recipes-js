/* eslint-disable -- experimental */
'use client'

import React, { createRef, useEffect, useRef, useState } from 'react'

interface DivProps {
  ref: React.RefObject<HTMLInputElement | null>
  value: string
  focusOnMount: boolean
  onChange: (
    ref: React.RefObject<HTMLInputElement | null>,
    value: string,
  ) => void
  onEnterPressed: (ref: React.RefObject<HTMLInputElement | null>) => void
}
const IngredientRow = (props: DivProps) => {
  //const [value, setValue] = useState('')
  //const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (props.focusOnMount && props.ref.current) {
      const sel = window.getSelection()
      console.log('Setting focus on:', props.ref.current)
      if (sel) {
        console.log('Selection exists:', sel)
        const range = document.createRange()
        range.setStart(props.ref.current, props.ref.current.value.length)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
      }
      props.ref.current.focus()
    }
  }, [])

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log('Change event:', event.target.value)
  //   setValue(event.target.value)
  //   props.onChange(props.ref, event)
  // }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      props.onEnterPressed(props.ref)
      event.preventDefault()
    }
  }

  const handleInput = (event: React.InputEvent<HTMLInputElement>) => {
    console.log('Input event:', event)
    const inputType = event.nativeEvent.inputType
    if (inputType === 'insertText') {
      const currentValue = event.currentTarget.value
      // setValue((prev) => {
      // const newValue = prev + currentValue
      props.onChange(props.ref, event.currentTarget.value)
      //   return newValue
      // })
    } else if (inputType === 'insertFromPaste') {
      console.log('Text pasted:', event.currentTarget.value)
    } else if (inputType === 'deleteContentBackward') {
      // Handle backspace or delete key
      console.log('Backspace or delete key pressed')
    } else {
      console.log(`Unsupported input type: ${inputType}`)
    }
  }

  return (
    <input
      ref={props.ref}
      className="block focus:outline-none focus:bg-transparent"
      value={props.value}
      //onChange={handleChange}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
    />
  )
}

type InputsType = {
  content: string
  error?: string
  ref: React.RefObject<HTMLInputElement | null>
  focusOnMount: boolean
}

export const EditableUl3 = () => {
  const [content, setContent] = useState<InputsType[]>([
    { content: '', ref: useRef<HTMLInputElement>(null), focusOnMount: true },
  ])
  const textAreaRef = useRef<HTMLUListElement>(null)
  const [error, setError] = useState<string | undefined>()

  const handleInput = (
    ref: React.RefObject<HTMLInputElement | null>,
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    console.log('Input event:', event.currentTarget.innerText)
    console.log(event.nativeEvent)
    setError('error')
    //setCaretAtEnd(event.currentTarget)
  }

  // const setCaretAtEnd = (element: HTMLUListElement) => {
  //   const range = document.createRange()
  //   range.selectNodeContents(element)
  //   range.collapse(false)
  //   const selection = window.getSelection()!
  //   selection.removeAllRanges()
  //   selection.addRange(range)
  //   element.focus()
  // }

  // const getCaretPosition = (element: HTMLUListElement) => {
  //   const position: { row: number; column: number } = {
  //     row: 0,
  //     column: 0,
  //   }

  //   var caretPosition = 0
  //   var selection = window.getSelection()!
  //   if (selection.rangeCount) {
  //     var range = selection.getRangeAt(0)
  //     if (range.commonAncestorContainer.parentNode == element) {
  //       caretPosition = range.endOffset
  //     }
  //   }

  //   const textBeforeCursor = element.innerText.substring(0, caretPosition)
  //   const row = textBeforeCursor.split('\n').length

  //   // Calculate column position we have 3 columns in textarea
  //   const currentRowText = textBeforeCursor.split('\n')[row - 1] || ''
  //   const column = currentRowText.split(' ').length

  //   position.row = row - 1
  //   position.column = column - 1

  //   return position
  // }

  const handleChange = (
    ref: React.RefObject<HTMLInputElement | null>,
    value: string,
  ) => {
    console.log('Change event:', value)
    setContent((prev) => {
      const index = prev.findIndex((item) => item.ref === ref)
      if (index !== -1) {
        const newContent = [...prev]
        newContent[index] = {
          ...newContent[index],
          content: value,
        }
        return newContent
      }
      return prev
    })
  }

  const handleKeyDown = (ref: React.RefObject<HTMLInputElement | null>) => {
    setContent((prev) => {
      const index = prev.findIndex((item) => item.ref === ref)
      if (index === -1) {
        return prev
      }
      for (let i = index + 1; i < prev.length; i++) {
        prev[i].focusOnMount = false
      }
      return [
        ...prev.slice(0, index + 1),
        { content: '', ref: createRef<HTMLInputElement>(), focusOnMount: true },
        ...prev.slice(index + 1),
      ]
    })
  }

  return (
    <div>
      {content.map((item, index) => (
        <React.Fragment key={index}>
          <IngredientRow
            ref={item.ref}
            value={item.content}
            focusOnMount={item.focusOnMount}
            onChange={handleChange}
            onEnterPressed={handleKeyDown}
          />
        </React.Fragment>
      ))}
    </div>
  )
}
