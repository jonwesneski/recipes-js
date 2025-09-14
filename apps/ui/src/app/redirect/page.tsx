'use server'

import { cookies } from 'next/headers'
import ClientRedirect from './_redirect'

const Page = async () => {
  const token = (await cookies()).get('access_token')?.value
  console.log(' from cookie:', await cookies())
  return <ClientRedirect accessToken={token} />
}
export default Page
