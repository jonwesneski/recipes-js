import { mergeCss } from '@repo/design-system'
import React, { type ReactElement, useEffect, useRef, useState } from 'react'
import { type ITabProps } from './Tab'

interface ITabsProps {
  children: ReactElement<ITabProps> | ReactElement<ITabProps>[]
}
const Tabs = ({ children }: ITabsProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const _children = React.Children.toArray(
    children,
  ) as ReactElement<ITabProps>[]

  const handleScroll = () => {
    if (contentRef.current) {
      if (contentRef.current.scrollTop > 100) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }
  }

  useEffect(() => {
    const currentRef = contentRef.current
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll)
      return () => {
        currentRef.removeEventListener('scroll', handleScroll)
      }
    }
  }, [activeTab])

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div>
      <div className="border-b border-solid flex">
        {React.Children.map(_children, (child, index) => {
          if (!React.isValidElement<ITabProps>(child)) return null

          return (
            <button
              key={child.props.label}
              type="button"
              className={mergeCss('p-2', {
                'border-t border-l border-r border-solid -mb-px font-bold':
                  index === activeTab,
                'border-transparent hover:font-bold hover:cursor-pointer':
                  index !== activeTab,
              })}
              onClick={() => setActiveTab(index)}
            >
              {child.props.label}
            </button>
          )
        })}
      </div>
      <div className="pt-5">
        <div className="flex justify-center mb-2">
          <button
            type="button"
            onClick={scrollToTop}
            className={mergeCss(
              'font-bold py-2 px-4 underline underline-offset-4 decoration-dotted',
              {
                'opacity-100 visible cursor-pointer': showBackToTop,
                'opacity-0 invisible pointer-events-none': !showBackToTop,
              },
            )}
          >
            back to top
          </button>
        </div>
        <div ref={contentRef} className="h-1/2 overflow-y-auto">
          {_children[activeTab]}
        </div>
      </div>
    </div>
  )
}

export default Tabs
