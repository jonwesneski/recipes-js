import * as PropTypes from 'prop-types'
import React, {
  forwardRef,
  JSX,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

function normalizeHtml(str: string): string {
  return (
    str && str.replace(/&nbsp;|\u202F|\u00A0/g, ' ').replace(/<br \/>/g, '<br>')
  )
}

function replaceCaret(el: HTMLElement) {
  const target = document.createTextNode('')
  el.appendChild(target)
  const isTargetFocused = document.activeElement === el
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    var sel = window.getSelection()
    if (sel !== null) {
      var range = document.createRange()
      range.setStart(target, target.nodeValue.length)
      //range.selectNodeContents(target)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
      //el.focus()
    }
    if (el instanceof HTMLElement) el.focus()
  }
}

export type ContentEditableEvent = React.SyntheticEvent<any, Event> & {
  target: { value: string }
}
type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R
type DivProps = Modify<
  JSX.IntrinsicElements['div'],
  { onChange: (event: ContentEditableEvent) => void }
>

export interface Props extends DivProps {
  html: string
  disabled?: boolean
  tagName?: string
  className?: string
  style?: Object
  innerRef?: React.RefObject<HTMLElement> | Function
}

const ContentEditable = forwardRef<HTMLElement, Props>((props, ref) => {
  const {
    tagName,
    html,
    innerRef,
    onChange,
    onBlur,
    onKeyUp,
    onKeyDown,
    disabled,
    ...rest
  } = props

  const localRef = useRef<HTMLElement>(null)
  const lastHtml = useRef(html)

  // Expose ref
  useImperativeHandle(ref, () => localRef.current as HTMLElement)
  useEffect(() => {
    if (typeof innerRef === 'function') {
      innerRef(localRef.current)
    } else if (innerRef && 'current' in innerRef) {
      ;(innerRef as React.RefObject<HTMLElement>).current = localRef.current!
    }
  }, [innerRef])

  // Manual DOM update if html prop changes
  useEffect(() => {
    const el = localRef.current
    if (!el) return
    if (normalizeHtml(html) !== normalizeHtml(el.innerHTML)) {
      //if (html !== el.innerHTML) {
      el.innerHTML = html
    }
    lastHtml.current = html
    // const plainEl = el.querySelector('li.input')
    // console.log(el, 'dddd')
    // if (plainEl) {
    //   replaceCaret(plainEl as HTMLElement)
    // }
    // replaceCaret(el)
  }, [html])

  // Emit change
  const emitChange = useCallback(
    (originalEvt: React.SyntheticEvent<any>) => {
      const el = localRef.current
      if (!el) return
      const currentHtml = el.innerHTML
      if (
        onChange &&
        normalizeHtml(currentHtml) !== normalizeHtml(lastHtml.current)
      ) {
        //if (onChange && currentHtml !== lastHtml.current) {
        const evt = Object.assign({}, originalEvt, {
          target: {
            value: currentHtml,
          },
        })
        onChange(evt)
      }
      lastHtml.current = currentHtml
    },
    [onChange],
  )

  // Render
  return React.createElement(
    tagName || 'div',
    {
      ...rest,
      ref: localRef,
      contentEditable: !disabled,
      dangerouslySetInnerHTML: { __html: html },
      onInput: emitChange,
      onBlur: onBlur || emitChange,
      onKeyUp: onKeyUp || emitChange,
      onKeyDown: onKeyDown || emitChange,
    },
    props.children,
  )
})

ContentEditable.propTypes = {
  html: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  tagName: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
}

export default ContentEditable
