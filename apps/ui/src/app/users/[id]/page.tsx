import { recipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { usersControllerUserV1 } from '@repo/codegen/users'
import UserPublic from './_page'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const [user, recipes] = await Promise.all([
    usersControllerUserV1(id),
    recipesControllerRecipesListV1({
      filters: { userId: id },
    }),
  ])
  return <UserPublic user={user} recipes={recipes} />
}
export default Page
