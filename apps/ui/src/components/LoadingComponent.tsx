'use client'

import { useHealthCheckControllerStatus } from '@repo/codegen/healthCheck'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const CenterDiv = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center w-full h-screen">
    {children}
  </div>
)

const Loading = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const skipApiCall = pathname === '/redirect'

  const { isFetching, error, isSuccess } = useHealthCheckControllerStatus({
    query: { enabled: !skipApiCall },
  })
  let timer: NodeJS.Timeout

  const [assumeServerIsProvisioning, setAssumeServerIsProvisioning] =
    useState(false)

  useEffect(() => {
    timer = setTimeout(() => {
      setAssumeServerIsProvisioning(true)
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (error && error.code !== 'ERR_NETWORK') {
      console.error('Health check failed:', error)
    } else if (error) {
      console.error('some other error:', error)
    }
  }, [error])

  useEffect(() => {
    if (isSuccess) {
      if (timer) {
        clearTimeout(timer)
      }
      setAssumeServerIsProvisioning(false)
    }
    return
  }, [isSuccess])

  if (isFetching) {
    return (
      <CenterDiv>
        <h2 className="font-bold">Loading...</h2>
        {assumeServerIsProvisioning ? (
          <h2 className="font-bold">
            The server is getting ready, it may take up to 5 minutes. Thank you
            for your patience!
          </h2>
        ) : null}
      </CenterDiv>
    )
  }

  if (error) {
    return (
      <CenterDiv>
        <h2 className="font-bold">
          Having trouble connecting to server. Please try again later.
        </h2>
      </CenterDiv>
    )
  }

  return <>{children}</>
}

export default Loading
