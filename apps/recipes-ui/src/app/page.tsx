'use client'

import { MouseEvent } from 'react'

const Page = () => {
  const handleGoogleOAuth = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`
  }

  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <div className="block">
        <h1>Sign in with:</h1>
        <button type="button" onClick={handleGoogleOAuth}>
          Google
        </button>
      </div>
    </div>
  )
}
export default Page
