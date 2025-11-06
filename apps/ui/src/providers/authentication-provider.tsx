'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

export type AuthenticationType = {
  accessToken?: string
  setAccessToken: (_value: string) => void
  clearAccessToken: () => void
}
export const AuthenticationContext = createContext<AuthenticationType | null>(
  null,
)

export interface AuthenticationProviderProps {
  children: ReactNode
  token?: string
}

export const AuthenticationProvider = ({
  children,
  token,
}: AuthenticationProviderProps) => {
  const [accessToken, _setAccessToken] = useState<string | undefined>(
    token ?? '1',
  )

  const setAccessToken = (value: string) => {
    _setAccessToken(value)
  }

  const clearAccessToken = () => {
    _setAccessToken(undefined)
  }

  return (
    <AuthenticationContext.Provider
      value={{ accessToken, setAccessToken, clearAccessToken }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext)
  if (!context) {
    throw new Error(
      `${useAuthentication.name} must be used within a ${AuthenticationProvider.name}`,
    )
  }
  return context
}
