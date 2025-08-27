'use client'

import { useAuthentication } from '@src/providers/authentication-provider'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

interface IRedirectProps {
  accessToken?: string
}
const ClientRedirect = (props: IRedirectProps) => {
  const { accessToken, setAccessToken } = useAuthentication()

  useEffect(() => {
    const fetch = () => {
      if (accessToken) {
        redirect('/recipes')
      } else if (props.accessToken) {
        setAccessToken(props.accessToken)
      } else {
        redirect('/')
      }
    }

    fetch()
  }, [accessToken, setAccessToken])

  return null
}
export default ClientRedirect
