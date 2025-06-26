'use client'

import { usersControllerUserV1 } from '@repo/recipes-codegen/users'
import { useAuthentication } from '@src/providers/authentication-provider'
import { useUserStore } from '@src/providers/use-store-provider'
import { jwtDecode } from 'jwt-decode'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const ClientRedirect = () => {
  const { accessToken, setAccessToken } = useAuthentication()
  const {
    setEmail,
    setHandle,
    setName,
    setUseDarkMode,
    setUseFractions,
    setUseImperial,
    setDiet,
  } = useUserStore((state) => state)
  const searchParams = useSearchParams()
  const queryToken = searchParams.get('token')

  useEffect(() => {
    const fetch = async () => {
      if (typeof window !== 'undefined') {
        if (accessToken) {
          redirect('/recipes')
        } else if (queryToken) {
          try {
            const decodedToken: any = jwtDecode(queryToken)
            setEmail(decodedToken.email)
            setName(decodedToken.name)
            setHandle(decodedToken.handle)
            setUseDarkMode(decodedToken.useDarkMode)
            setUseFractions(decodedToken.useFractions)
            setUseImperial(decodedToken.useImperial)
            const user = await usersControllerUserV1(decodedToken.handle)
            setDiet(user.diet)
            console.log('Decoded JWT:', decodedToken)
          } catch (error) {
            console.error('Error decoding JWT:', error)
          }
          setAccessToken(queryToken)
        }
      }
    }

    fetch()
  }, [accessToken, setAccessToken])

  return null
}
export default ClientRedirect
