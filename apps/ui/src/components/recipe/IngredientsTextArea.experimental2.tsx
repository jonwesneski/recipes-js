/* eslint-disable -- experimental */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import ContentEditable, { ContentEditableEvent } from './test'

interface DivProps {
  error?: string
}
const IngredientRow = (props: DivProps) => {
  const [content, setContent] = useState('Initial content')
  //const [error, setError] = useState<string | null>(null)

  return (
    <li>
      {content}
      {props.error && (
        <ul contentEditable="false">
          <li className="text-red-900">{props.error}</li>
        </ul>
      )}
    </li>
  )
}

export const EditableUl = () => {
  const [content, setContent] = useState('Initial content')
  const textAreaRef = useRef<HTMLUListElement>(null)
  const [error, setError] = useState<string | undefined>()

  const handleInput = (event: React.InputEvent<HTMLUListElement>) => {
    console.log('Input event:', event.currentTarget.innerText)
    console.log(event.nativeEvent)
    setContent(event.currentTarget.textContent!)
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
  const [html, setHtml] = useState<string>('')
  const [value, setValue] = useState<string[]>(['tt'])

  useEffect(() => {
    const listHtml = value
      .map(
        (item) =>
          //`<li class="input" style="min-height: 20px">${item}</li><li class="error"></li>`,
          `<li class="input" style="min-height: 20px">${item}</li>`,
      )
      .join('')
    setHtml(`<ul>${listHtml}</ul>`)
  }, [value])

  const onChange = (items: string[]) => {
    setValue(items)
  }

  const handleChange = (event: ContentEditableEvent) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(
      event.currentTarget.innerHTML,
      'text/html',
    )
    const items = Array.from(doc.querySelectorAll('li.input')).map((li) => {
      // Remove the error ul before extracting text
      // const errorUl = li.querySelector('ul')
      // if (errorUl) errorUl.remove()
      return li.textContent?.trim() || ' '
    })

    onChange(items)
    console.log('Change event:', items)
    setHtml(event.currentTarget.innerHTML)
  }

  return (
    // <ul contentEditable="true" onInput={handleInput} ref={textAreaRef}>
    //   <IngredientRow error={error} />
    // </ul>
    <ContentEditable html={html} onChange={handleChange} tagName="div" />
  )
}
