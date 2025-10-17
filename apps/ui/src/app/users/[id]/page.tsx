import { usersControllerUserV1 } from '@repo/codegen/users'
import UserPublic from './_page'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  //const { id } = use(params)
  const { id } = await params
  const user = await usersControllerUserV1(id)
  return <UserPublic {...user} />
}
export default Page
