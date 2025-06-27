'use client'

import { useAuthentication } from '@src/providers/authentication-provider'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const ClientRedirect = () => {
  const { accessToken, setAccessToken } = useAuthentication()
  const searchParams = useSearchParams()
  const queryToken = searchParams.get('token')

  useEffect(() => {
    const fetch = () => {
      if (typeof window !== 'undefined') {
        if (accessToken) {
          redirect('/recipes')
        } else if (queryToken) {
          setAccessToken(queryToken)
        }
      }
    }

    fetch()
  }, [accessToken, setAccessToken])

  return null
}
export default ClientRedirect
