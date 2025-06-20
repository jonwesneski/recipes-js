'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthentication } from '../../providers/authentication-provider'

export function ClientRedirect(props: { accessToken: string | undefined }) {
  const { accessToken, setAccessToken } = useAuthentication()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (accessToken) {
        redirect('/recipes')
      } else if (props.accessToken) {
        setAccessToken(props.accessToken)
      }
    }
  }, [accessToken])

  return null
}
