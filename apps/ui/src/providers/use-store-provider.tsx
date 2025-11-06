'use client'

import type {
  MeasurementFormat,
  NumberFormat,
  UiTheme,
} from '@repo/codegen/model'
import { usersControllerUserAccountV1 } from '@repo/codegen/users'
import { jwtGoogleSchema } from '@repo/zod-schemas'
import {
  type UserState,
  type UserStore,
  createUserStore,
  defaultInitState,
} from '@src/stores/user-store'
import { jwtDecode } from 'jwt-decode'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useStore } from 'zustand'
import { useAuthentication } from './authentication-provider'

const getGuestState = (): Partial<UserState> => {
  return {
    numberFormat: (localStorage.getItem('numberFormat') ??
      'default') as NumberFormat,
    measurementFormat: (localStorage.getItem('measurementFormat') ??
      'default') as MeasurementFormat,
    uiTheme: (localStorage.getItem('uiTheme') ?? 'system') as UiTheme,
  }
}

export type UserStoreApi = ReturnType<typeof createUserStore>
export const UserStoreContext = createContext<UserStoreApi | null>(null)

export interface UserStoreProviderProps {
  children: ReactNode
  initialState?: Partial<UserStore>
}

export const UserStoreProvider = ({
  children,
  initialState,
}: UserStoreProviderProps) => {
  const storeRef = useRef<UserStoreApi | null>(null)

  storeRef.current ??= createUserStore({
    ...defaultInitState,
    ...initialState,
  })

  const { accessToken } = useAuthentication()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    const fetch = async () => {
      if (typeof window !== 'undefined' && storeRef.current) {
        setIsInitialized(true)
        if (accessToken) {
          try {
            const decodedToken = jwtGoogleSchema.parse(jwtDecode(accessToken))
            const user = await usersControllerUserAccountV1()
            storeRef.current.setState(user)
          } catch (error) {
            console.error('Error decoding JWT:', error)
          }
        } else {
          storeRef.current.setState(getGuestState())
        }
      }
    }

    fetch().catch((e: unknown) => console.error(e))
  }, [accessToken, setIsInitialized])

  return isInitialized ? (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  ) : null
}

export const useUserStore = <T,>(selector: (_store: UserStore) => T): T => {
  const store = useContext(UserStoreContext)
  if (!store) {
    throw new Error(
      `${useUserStore.name} must be used within a ${UserStoreProvider.name}`,
    )
  }
  return useStore(store, selector)
}
