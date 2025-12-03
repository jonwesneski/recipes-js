'use client'

interface ISectionLayoutProps {
  className?: string
  title: string
  children: React.ReactNode
}
export const SectionLayout = (props: ISectionLayoutProps) => {
  return (
    <>
      <section className={props.className}>
        <h1 className="text-3xl font-bold mb-10">{props.title}</h1>
        {props.children}
      </section>
      <hr className="border-t border-dotted mt-10" />
    </>
  )
}
