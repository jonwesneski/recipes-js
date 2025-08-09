'use client'

import googleIcon from '@public/Google__G__logo.svg'
import { CustomButton } from '@repo/design-system'
import { useAuthentication } from '@src/providers/authentication-provider'
import Image from 'next/image'
import { type MouseEvent } from 'react'

const Page = () => {
  const { clearAccessToken } = useAuthentication()
  const handleGoogleOAuth = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    clearAccessToken()
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`
  }

  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <div className="w-60">
        <div className="border-b mb-4">
          <h1 className="font-extrabold">Login with:</h1>
        </div>

        <div
          className="mx-auto flex flex-col items-center w-4/5 gap-4"
          id="doodle"
        >
          <CustomButton
            onClick={handleGoogleOAuth}
            variant="opposite"
            className="flex items-start w-full"
          >
            <Image src={googleIcon} alt="google" className="mx-4 grow-0" />
            Google.
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
export default Page
