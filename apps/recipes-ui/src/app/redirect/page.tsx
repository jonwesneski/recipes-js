import { cookies } from 'next/headers'
import React from 'react'

const Page = async () => {
  const cookieStore = await cookies()
  const myCookie = cookieStore.get('access_token')
  cookieStore.getAll()
  console.log('PAGE', myCookie)

  return (
    <>
      {cookieStore.getAll().map((value) => {
        return (
          <React.Fragment key={value.name}>
            <p>
              {value.name} {value.value}
            </p>
          </React.Fragment>
        )
      })}
      {/* <ClientRedirect accessToken={myCookie?.value} /> */}
    </>
  )
}
export default Page
