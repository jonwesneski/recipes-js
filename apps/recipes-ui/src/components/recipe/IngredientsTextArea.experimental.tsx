/* eslint-disable -- experimental */
'use client'

import React, { useRef, useState } from 'react'

export const EditableDiv = () => {
  const [content, setContent] = useState('Initial content')
  const textAreaRef = useRef<HTMLDivElement>(null)

  const handleInput = (event: React.InputEvent<HTMLDivElement>) => {
    setContent(event.currentTarget.textContent!)
    setCaretAtEnd(event.currentTarget)
  }

  const setCaretAtEnd = (element: HTMLDivElement) => {
    const range = document.createRange()
    range.selectNodeContents(element)
    range.collapse(false)
    const selection = window.getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)
    element.focus()
  }

  const getCaretPosition = (element: HTMLDivElement) => {
    const position: { row: number; column: number } = {
      row: 0,
      column: 0,
    }

    var caretPosition = 0
    var selection = window.getSelection()!
    if (selection.rangeCount) {
      var range = selection.getRangeAt(0)
      if (range.commonAncestorContainer.parentNode == element) {
        caretPosition = range.endOffset
      }
    }

    const textBeforeCursor = element.innerText.substring(0, caretPosition)
    const row = textBeforeCursor.split('\n').length

    // Calculate column position we have 3 columns in textarea
    const currentRowText = textBeforeCursor.split('\n')[row - 1] || ''
    const column = currentRowText.split(' ').length

    position.row = row - 1
    position.column = column - 1

    return position
  }

  return (
    <div
      //placeholder https://stackoverflow.com/questions/20726174/placeholder-for-contenteditable-div
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={handleInput}
      ref={textAreaRef}
      data-testid="ingredients-text-area"
    >
      {content}
    </div>
  )
}
