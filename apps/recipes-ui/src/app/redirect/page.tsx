import { cookies } from 'next/headers'
import { ClientRedirect } from './_clientRedirect'

const Page = async () => {
  const cookieStore = await cookies()
  const myCookie = cookieStore.get('access_token')
  console.log('PAGE', myCookie)
  return <ClientRedirect accessToken={myCookie?.value} />
}
export default Page
