'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

export type AuthenticationType = {
  accessToken: string | null
  setAccessToken: (_value: string) => void
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
    const token = localStorage.getItem('accessToken')
    if (token) {
      _setAccessToken(token)
    }
  }, [])

  const setAccessToken = (value: string) => {
    localStorage.setItem('accessToken', value)
    _setAccessToken(value)
  }

  return (
    <AuthenticationContext.Provider value={{ accessToken, setAccessToken }}>
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
