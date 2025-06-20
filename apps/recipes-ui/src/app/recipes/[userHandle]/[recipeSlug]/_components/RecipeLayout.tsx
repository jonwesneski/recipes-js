'use client'

export interface IRecipeLayoutProps {
  title: string
  subtitle: string | null
  children: React.ReactNode
}
export const RecipeLayout = (props: IRecipeLayoutProps) => {
  return (
    <>
      <div
        className="recipe-header text-center"
        style={{ margin: 'auto', maxWidth: '800px' }}
      >
        <h1 className="text-3xl">{props.title}</h1>
        <h2>{props.subtitle}</h2>
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
