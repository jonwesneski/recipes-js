'use client'

import { useAuthentication } from '@src/providers/authentication-provider'
import { redirect, useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface IRedirectProps {
  accessToken?: string
}
const ClientRedirect = (props: IRedirectProps) => {
  const { accessToken, setAccessToken } = useAuthentication()
  const router = useRouter()

  useEffect(() => {
    const fetch = () => {
      if (accessToken) {
        router.push('/recipes')
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
