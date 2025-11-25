import { usersControllerFollowersV1 } from '@repo/codegen/users'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import Account from './_page'

const Page = async () => {
  const token = (await cookies()).get('access_token')?.value ?? ''
  const id = jwtDecode(token).sub ?? ''
  const followers = await usersControllerFollowersV1(id, undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return <Account followers={followers} />
}
export default Page
