'use client'

import { Label, SharedInput } from '@repo/ui'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { Steps } from './Steps'

interface RecipeProps {
  editEnabled: boolean
}
export const Recipe = (props: RecipeProps) => {
  return (
    <RecipeStoreProvider initialState={{ editEnabled: props.editEnabled }}>
      <div className="[&>*]:block mb-10">
        <SharedInput name="recipe" placeholder="Recipe name" />
        <Label text="recipe name" htmlFor="recipe" />
        <SharedInput name="description" placeholder="Short description" />
        <Label text="description" htmlFor="description" />
        <SharedInput name="prep-time" placeholder="30" variant="none" />
        <Label text="prep. time in min." htmlFor="prep-time" />
        <SharedInput name="cook-time" placeholder="95" variant="none" />
        <Label text="cook time in min." />
      </div>
      <Steps />
    </RecipeStoreProvider>
  )
}
