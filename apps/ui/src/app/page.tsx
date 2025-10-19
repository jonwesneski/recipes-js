'use client'

import GoogleLogo from '@public/Google__G__logo.svg'
import { IconTextButton, TextButton } from '@repo/design-system'
import { useAuthentication } from '@src/providers/authentication-provider'
import { type Svg } from '@src/types/svg'
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
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

  const handleGuest = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    clearAccessToken()
    await deleteCookie()
    redirect('/recipes')
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <h1 className="mb-36">recipehall.</h1>
      <div className="w-60">
        <div className="border-b mb-4">
          <h1 className="font-extrabold">Login with:</h1>
        </div>

        <div
          className="mx-auto flex flex-col items-center w-5/6 gap-4"
          id="doodle"
        >
          <IconTextButton
            svgIcon={GoogleLogo as Svg}
            text="Google"
            onClick={handleGoogleOAuth}
            className="w-full"
          />
          <TextButton
            text="Continue as Guest"
            onClick={(e: MouseEvent<HTMLButtonElement>) => void handleGuest(e)}
            variant="opposite"
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
export default Page
