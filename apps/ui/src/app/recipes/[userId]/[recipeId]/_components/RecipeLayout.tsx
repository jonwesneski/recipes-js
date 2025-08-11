'use client'

export interface IRecipeLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}
export const RecipeLayout = (props: IRecipeLayoutProps) => {
  return (
    <>
      <div
        className="text-center"
        style={{ margin: 'auto', maxWidth: '800px' }}
      >
        <h1 className="text-3xl font-bold">{props.title}</h1>
        <hr className="h-1 bg-text border-none" />
        <p className="mt-5">{props.subtitle}</p>
      </div>
      <div
        className="recipe-content"
        style={{ margin: 'auto', maxWidth: '800px' }}
      >
        {props.children}
      </div>
    </>
  )
}
