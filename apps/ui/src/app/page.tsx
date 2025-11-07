'use client'

import GoogleLogo from '@public/Google__G__logo.svg'
import { useAuthControllerLogout } from '@repo/codegen/auth'
import { IconTextButton, TextButton } from '@repo/design-system'
import { type Svg } from '@src/types/svg'
import { useEffect, type MouseEvent } from 'react'
import { deleteCookie } from './deleteAuthCookie.action'

const Page = () => {
  const { mutateAsync } = useAuthControllerLogout({
    mutation: {
      retry: false,
    },
  })

  useEffect(() => {
    const run = async () => {
      await mutateAsync()
    }
    run().catch((e: unknown) => console.error(e))
  }, [])

  const handleGoogleOAuth = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!(process.env.NEXT_PUBLIC_ENABLE_MSW === 'true')) {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    } else {
      window.location.href = '/recipes'
    }
  }

  const handleGuest = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await deleteCookie()
    // I want to trigger a refresh/reload
    window.location.href = '/recipes'
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
