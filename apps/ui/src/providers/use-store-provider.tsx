'use client'

import {
  type UserState,
  type UserStore,
  createUserStore,
  defaultInitState,
} from '@src/stores/user-store'
import { usePathname } from 'next/navigation'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useStore } from 'zustand'

// const getGuestState = (): Partial<UserState> => {
//   return {
//     numberFormat: (localStorage.getItem('numberFormat') ??
//       'default') as NumberFormat,
//     measurementFormat: (localStorage.getItem('measurementFormat') ??
//       'default') as MeasurementFormat,
//     uiTheme: (localStorage.getItem('uiTheme') ?? 'system') as UiTheme,
//   }
// }

export type UserStoreApi = ReturnType<typeof createUserStore>
export const UserStoreContext = createContext<UserStoreApi | null>(null)

export interface UserStoreProviderProps {
  children: ReactNode
  initialState?: Partial<UserState>
}

export const UserStoreProvider = ({
  children,
  initialState,
}: UserStoreProviderProps) => {
  const isHome = usePathname() === '/'
  const storeRef = useRef<UserStoreApi | null>(null)
  storeRef.current ??= createUserStore({
    ...defaultInitState,
    ...(!isHome ? initialState : null),
  })
  const [isInitialized, setIsInitialized] = useState<boolean>(
    isHome || Boolean(initialState?.id),
  )

  useEffect(() => {
    // const fetch = async () => {
    //   if (!isInitialized && typeof window !== 'undefined' && storeRef.current) {
    //     try {
    //       const user = await usersControllerUserAccountV1()
    //       storeRef.current.setState(user)
    //     } catch (error: unknown) {
    //       console.log(error, 'most likely 401; todo handle later')
    //       storeRef.current.setState(getGuestState())
    //     }
    //     setIsInitialized(true)
    //   }
    // }
    // todo: I may get rid of this logic,useEffect,useState altogether
    //fetch().catch((e: unknown) => console.error(e))
    setIsInitialized(true)
  }, [isInitialized, setIsInitialized])

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
