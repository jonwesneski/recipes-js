'use client'

import { Fragment } from 'react'

interface ISectionListLayoutProps {
  className?: string
  items: {
    title: string
    children: React.ReactNode
  }[]
}
export const SectionListLayout = ({
  className,
  items,
}: ISectionListLayoutProps) => {
  return (
    <>
      {items.map((section) => (
        <Fragment key={section.title}>
          <section className={className}>
            <h2 className="text-3xl font-bold mb-10">{section.title}</h2>
            {section.children}
          </section>
          <hr className="border-t border-dotted mt-10" />
        </Fragment>
      ))}
    </>
  )
}
