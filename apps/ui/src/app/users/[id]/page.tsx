import { recipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { usersControllerUserV1 } from '@repo/codegen/users'
import UserPublic from './_page'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const user = await usersControllerUserV1(id)
  const recipes = await recipesControllerRecipesListV1({
    params: { userId: id },
  })
  return <UserPublic user={user} recipes={recipes} />
}
export default Page
