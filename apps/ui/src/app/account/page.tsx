import { usersControllerFollowingsV1 } from '@repo/codegen/users'
import { getAccessToken } from '@src/utils/getAccessToken'
import { jwtDecode } from 'jwt-decode'
import Account from './_page'

const Page = async () => {
  const token = await getAccessToken()
  const id = jwtDecode(token).sub ?? ''
  const followings = await usersControllerFollowingsV1(id, undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return <Account followings={followings} />
}
export default Page
