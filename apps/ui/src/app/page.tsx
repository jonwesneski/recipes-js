'use client'

import GoogleLogo from '@public/Google__G__logo.svg'
import Logo from '@public/logo.svg'
import { useAuthControllerLogout } from '@repo/codegen/auth'
import { IconTextButton, TextButton } from '@repo/design-system'
import { type Svg } from '@src/types/svg'
import { generateJwt } from '@src/utils/genericJwt'
import { redirect } from 'next/navigation'
import { useEffect, type MouseEvent } from 'react'
import { deleteCookie } from './deleteAuthCookie.action'

const Page = () => {
  const { mutateAsync } = useAuthControllerLogout({
    mutation: {
      retry: false,
    },
  })

  const clearLocalStorage = () => {
    localStorage.removeItem('numberFormat')
    localStorage.removeItem('measurementFormat')
    localStorage.removeItem('uiTheme')
  }

  useEffect(() => {
    clearLocalStorage()
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
      /**
       *  Once I have frontend and backend on same domains, I can get rid of this hack:
       *  https://github.com/jonwesneski/recipes-js/pull/83
       * This hack is basically doing a POST to frontend and then I am setting
       * another cookie in the frontend just to be accessed in SSR only
       *  */
      void (async () => {
        const formData = new FormData()
        formData.append('access_token', await generateJwt())
        await fetch('api/redirect', {
          method: 'POST',
          body: formData,
        })
      })()
        .catch((e: unknown) => console.error(e))
        // Does not work if then() is before catch() for some reason
        .then(() => redirect('/recipes'))
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
      <Logo width="150px" height="150px" />
      <h1 className="mb-24">recipehall.</h1>

      <div className="w-60">
        <div className="border-b mb-4">
          <h2 className="font-extrabold">Login with:</h2>
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
