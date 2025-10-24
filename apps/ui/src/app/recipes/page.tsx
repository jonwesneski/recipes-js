import { recipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { RecipeList } from '@src/components'

const Page = async () => {
  const recipes = await recipesControllerRecipesListV1()
  return <RecipeList recipes={recipes} />
}
export default Page
