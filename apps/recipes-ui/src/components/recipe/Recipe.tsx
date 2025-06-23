'use client'

import { SharedInput } from '@repo/ui'
import { RecipeProvider } from '@src/providers/recipe-provider'
import { Steps } from './Steps'

interface RecipeProps {
  editEnabled: boolean
}
export const Recipe = (props: RecipeProps) => {
  return (
    <RecipeProvider enableEdit={props.editEnabled}>
      <div className="[&>*]:block">
        <SharedInput name="recipe" placeHolder="Recipe name" />
        <SharedInput name="description" placeHolder="Short description" />
        <Steps />
      </div>
    </RecipeProvider>
  )
}
