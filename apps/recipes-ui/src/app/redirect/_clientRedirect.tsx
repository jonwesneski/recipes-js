'use client'

import { redirect, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthentication } from '../../providers/authentication-provider'

export const ClientRedirect = (props: { accessToken: string | undefined }) => {
  const { accessToken, setAccessToken } = useAuthentication()
  const searchParams = useSearchParams()
  const queryToken = searchParams.get('token')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (accessToken) {
        redirect('/recipes')
      } else if (props.accessToken) {
        setAccessToken(props.accessToken)
      } else if (queryToken) {
        setAccessToken(queryToken)
      }
    }
  }, [props.accessToken, accessToken, setAccessToken])

  return null
}
