'use client'

import type {
  MeasurementFormat,
  NumberFormat,
  UiTheme,
} from '@repo/codegen/model'
import {
  type UserState,
  createUserStore,
  defaultInitState,
} from '@src/stores/user-store'
import { usePathname } from 'next/navigation'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react'

const getLocalState = (): Partial<UserState> => {
  return {
    numberFormat: (localStorage.getItem('numberFormat') ??
      defaultInitState.numberFormat) as NumberFormat,
    measurementFormat: (localStorage.getItem('measurementFormat') ??
      defaultInitState.measurementFormat) as MeasurementFormat,
    uiTheme: (localStorage.getItem('uiTheme') ??
      defaultInitState.uiTheme) as UiTheme,
  }
}

type UserStoreOptimistic = {
  isPending: boolean
  optimisticUiTheme: UiTheme
  optimisticMeasurementFormat: MeasurementFormat
  optimisticNumberFormat: NumberFormat
  updateUiTheme: (_value: UiTheme) => void
  updateMeasurementFormat: (_value: MeasurementFormat) => void
  updateNumberFormat: (_value: NumberFormat) => void
}

type UserStoreApi = ReturnType<typeof createUserStore> & UserStoreOptimistic
const UserStoreContext = createContext<UserStoreApi | null>(null)

interface UserStoreProviderProps {
  children: ReactNode
  initialState?: Partial<UserState>
}

export const UserStoreProvider = ({
  children,
  initialState,
}: UserStoreProviderProps) => {
  const isHome = usePathname() === '/'
  const storeRef = useRef(
    createUserStore({
      ...defaultInitState,
      ...(!isHome ? initialState : null),
    }),
  )

  const [isInitialized, setIsInitialized] = useState<boolean>(
    isHome || Boolean(initialState?.id),
  )

  useEffect(() => {
    if (!isInitialized) {
      storeRef.current.setState(getLocalState())
      setIsInitialized(true)
    }
  }, [])

  const [isPending, startTransition] = useTransition()
  const [optimisticUiTheme, addOptimisticUiTheme] = useOptimistic(
    storeRef.current.getState().uiTheme,
    (_, nextUiTheme: UiTheme) => nextUiTheme,
  )
  const [optimisticMeasurementFormat, addOptimisticMeasurementFormat] =
    useOptimistic(
      storeRef.current.getState().measurementFormat,
      (_, nextMeasurementFormat: MeasurementFormat) => nextMeasurementFormat,
    )
  const [optimisticNumberFormat, addOptimisticNumberFormat] = useOptimistic(
    storeRef.current.getState().numberFormat,
    (_, nextNumberFormat: NumberFormat) => nextNumberFormat,
  )

  const updateUiTheme = (uiTheme: UiTheme) => {
    startTransition(async () => {
      addOptimisticUiTheme(uiTheme)
      try {
        await storeRef.current.getState().setUiTheme(uiTheme)
      } catch (error) {
        console.error('Update failed', error)
      }
    })
  }

  const updateMeasurementFormat = (measurementFormat: MeasurementFormat) => {
    startTransition(async () => {
      addOptimisticMeasurementFormat(measurementFormat)
      try {
        await storeRef.current
          .getState()
          .setMeasurementFormat(measurementFormat)
      } catch (error) {
        console.error('Update failed', error)
      }
    })
  }

  const updateNumberFormat = (numberFormat: NumberFormat) => {
    startTransition(async () => {
      addOptimisticNumberFormat(numberFormat)
      try {
        await storeRef.current.getState().setNumberFormat(numberFormat)
      } catch (error) {
        console.error('Update failed', error)
      }
    })
  }

  return (
    <UserStoreContext.Provider
      value={{
        ...storeRef.current,
        isPending,
        optimisticUiTheme,
        updateUiTheme,
        optimisticMeasurementFormat,
        updateMeasurementFormat,
        optimisticNumberFormat,
        updateNumberFormat,
      }}
    >
      {children}
    </UserStoreContext.Provider>
  )
}

export const useUserStore = () => {
  const store = useContext(UserStoreContext)
  if (!store) {
    throw new Error(
      `${useUserStore.name} must be used within a ${UserStoreProvider.name}`,
    )
  }
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- combining types here
  const { getInitialState, getState, setState, subscribe, ...rest } = store
  return { ...getState(), ...rest }
}
