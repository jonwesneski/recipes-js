'use client'

import { NotificationRecipeAddedSchema } from '@repo/zod-schemas'
import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { io, type Socket } from 'socket.io-client'
import { useUserStore } from './use-store-provider'

export type NotificationType = object
export const NotificationContext = createContext<NotificationType | null>(null)

export interface NotificationProviderProps {
  children: ReactNode
}
export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const userId = useUserStore((state) => state.id)
  // eslint-disable-next-line no-undef-init -- it can be uninitialized
  let socket: Socket | undefined = undefined

  useEffect(() => {
    if (userId) {
      socket = io(process.env.NEXT_PUBLIC_API_URL)
      socket.emit('register', userId)

      socket.on('recipeAdded', (_data) => {
        try {
          const result = NotificationRecipeAddedSchema.parse(_data)
          console.log(result)
          // alert(`Notification: ${result}`)
        } catch (e) {
          console.log(e)
        }
      })
    }

    return () => {
      socket?.off('recipeAdded')
      socket?.disconnect()
    }
  }, [userId])

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      `${useNotification.name} must be used within a ${NotificationProvider.name}`,
    )
  }
  return context
}
