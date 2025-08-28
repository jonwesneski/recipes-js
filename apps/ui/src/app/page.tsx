'use client'

import GoogleLogo from '@public/Google__G__logo.svg'
import { IconTextButton, TextButton } from '@repo/design-system'
import { useAuthentication } from '@src/providers/authentication-provider'
import { redirect } from 'next/navigation'
import { useEffect, type MouseEvent } from 'react'
import { deleteCookie } from './deleteAuthCookie.action'

const Page = () => {
  const { clearAccessToken } = useAuthentication()

  useEffect(() => {
    const run = async () => {
      await deleteCookie()
    }
    run().catch(() => console.log('blah'))
  }, [])

  const handleGoogleOAuth = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    clearAccessToken()
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`
  }

  const handleGuest = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    clearAccessToken()
    redirect('/recipes')
  }

  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <div className="w-60">
        <div className="border-b mb-4">
          <h1 className="font-extrabold">Login with:</h1>
        </div>

        <div
          className="mx-auto flex flex-col items-center w-5/6 gap-4"
          id="doodle"
        >
          <IconTextButton
            icon={GoogleLogo as string}
            text="Google"
            altText="google"
            onClick={handleGoogleOAuth}
            className="w-full"
          />
          <TextButton
            text="Continue as Guest"
            onClick={handleGuest}
            variant="opposite"
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
export default Page
