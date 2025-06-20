'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'
import { type ModalStore, createModalStore } from '../stores/modal-store'

export type ModalStoreApi = ReturnType<typeof createModalStore>
export const ModalStoreContext = createContext<ModalStoreApi | null>(null)

export interface ModalStoreProviderProps {
  children: ReactNode
  initialState?: ModalStore
}

export const ModalStoreProvider = ({
  children,
  initialState,
}: ModalStoreProviderProps) => {
  const storeRef = useRef<ModalStoreApi | null>(null)

  storeRef.current ??= createModalStore(initialState)

  return (
    <ModalStoreContext.Provider value={storeRef.current}>
      {children}
    </ModalStoreContext.Provider>
  )
}

export const useModalStore = <T,>(selector: (_store: ModalStore) => T): T => {
  const store = useContext(ModalStoreContext)
  if (!store) {
    throw new Error(
      `${useModalStore.name} must be used within a ${ModalStoreProvider.name}`,
    )
  }
  return useStore(store, selector)
}
