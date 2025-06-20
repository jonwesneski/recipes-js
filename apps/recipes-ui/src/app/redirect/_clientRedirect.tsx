'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthentication } from '../../providers/authentication-provider'

export const ClientRedirect = (props: { accessToken: string | undefined }) => {
  const { accessToken, setAccessToken } = useAuthentication()
  console.log('clientredirect', props)
  useEffect(() => {
    console.log('clientredict mounting')
    if (typeof window !== 'undefined') {
      console.log('clientredict window defined', accessToken)
      if (accessToken) {
        redirect('/recipes')
      } else if (props.accessToken) {
        setAccessToken(props.accessToken)
      }
    }
  }, [props.accessToken, accessToken, setAccessToken])

  return null
}
