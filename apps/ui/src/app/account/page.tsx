import { usersControllerFollowersV1 } from '@repo/codegen/users'
import { getAccessToken } from '@src/utils/getAccessToken'
import { jwtDecode } from 'jwt-decode'
import Account from './_page'

const Page = async () => {
  const token = await getAccessToken()
  const id = jwtDecode(token).sub ?? ''
  const followers = await usersControllerFollowersV1(id, undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return <Account followers={followers} />
}
export default Page
