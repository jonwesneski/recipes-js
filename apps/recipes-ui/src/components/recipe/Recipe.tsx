'use client'

import { SharedInput } from '@repo/ui'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { Steps } from './Steps'

interface RecipeProps {
  editEnabled: boolean
}
export const Recipe = (props: RecipeProps) => {
  return (
    <RecipeStoreProvider initialState={{ editEnabled: props.editEnabled }}>
      <div className="[&>*]:block">
        <SharedInput name="recipe" placeholder="Recipe name" />
        <SharedInput name="description" placeholder="Short description" />
      </div>
      <Steps />
    </RecipeStoreProvider>
  )
}
