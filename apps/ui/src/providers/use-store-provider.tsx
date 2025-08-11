'use client'

import { usersControllerUserV1 } from '@repo/codegen/users'
import { jwtGoogleSchema } from '@repo/zod-schemas'
import {
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

  storeRef.current ??= createUserStore({ ...defaultInitState, ...initialState })

  const { accessToken } = useAuthentication()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    const fetch = async () => {
      if (typeof window !== 'undefined' && storeRef.current) {
        //const { setUser } = storeRef.current.getState()

        setIsInitialized(true)
        if (accessToken) {
          try {
            const decodedToken = jwtGoogleSchema.parse(jwtDecode(accessToken))
            const user = await usersControllerUserV1(decodedToken.sub)
            storeRef.current.setState(user)
          } catch (error) {
            console.error('Error decoding JWT:', error)
          }
        }
      }
    }

    fetch().catch((e: unknown) => console.log(e))
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
