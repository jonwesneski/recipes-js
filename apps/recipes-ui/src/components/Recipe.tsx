'use client'

import { SharedInput } from '@repo/ui'
import { Steps } from '@src/components/Steps'
import { RecipeProvider } from '@src/providers/recipe-provider'

interface RecipeProps {
  editable: boolean
}
export const Recipe = (props: RecipeProps) => {
  return (
    <RecipeProvider>
      <div className="[&>*]:block">
        <SharedInput name="recipe" placeHolder="Recipe name" />
        <SharedInput name="description" placeHolder="Short description" />
        <Steps editable={props.editable} />
      </div>
    </RecipeProvider>
  )
}
