'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

const ACCESS_TOKEN_KEY_NAME = 'accessToken'
export type AuthenticationType = {
  accessToken: string | null
  setAccessToken: (_value: string) => void
  clearAccessToken: () => void
}
export const AuthenticationContext = createContext<AuthenticationType | null>(
  null,
)

export interface AuthenticationProviderProps {
  children: ReactNode
}

export const AuthenticationProvider = ({
  children,
}: AuthenticationProviderProps) => {
  const [accessToken, _setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY_NAME)
    if (token) {
      _setAccessToken(token)
    }
  }, [])

  const setAccessToken = (value: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY_NAME, value)
    _setAccessToken(value)
  }

  const clearAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY_NAME)
    _setAccessToken(null)
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
