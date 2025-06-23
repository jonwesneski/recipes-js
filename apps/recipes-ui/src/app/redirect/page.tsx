'use client'
// import { cookies } from 'next/headers'
// import { ClientRedirect } from './_clientRedirect'

// const Page = async () => {
//   const cookieStore = await cookies()
//   const myCookie = cookieStore.get('access_token')

//   return <ClientRedirect accessToken={myCookie?.value} />
// }
// export default Page

import { useAuthentication } from '@src/providers/authentication-provider'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const ClientRedirect = () => {
  const { accessToken, setAccessToken } = useAuthentication()
  const searchParams = useSearchParams()
  const queryToken = searchParams.get('token')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (accessToken) {
        redirect('/recipes')
      } else if (queryToken) {
        setAccessToken(queryToken)
      }
    }
  }, [accessToken, setAccessToken])

  return null
}
export default ClientRedirect
