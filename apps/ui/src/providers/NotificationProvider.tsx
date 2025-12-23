'use client'

import { useCustomModal } from '@repo/design-system'
import { NotificationRecipeAddedSchema } from '@repo/zod-schemas'
import Toast, { type ToastType } from '@src/components/ToastComponent'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { io, type Socket } from 'socket.io-client'
import { useUserStore } from './use-store-provider'

export type ToastParams = {
  toastId: string
  title: string
  message: string
  type?: ToastType
  navigationUrl?: string
  durationMs?: number
}
export type NotificationType = {
  showToast: (_params: ToastParams) => void
}
export const NotificationContext = createContext<NotificationType | null>(null)

export interface NotificationProviderProps {
  children: ReactNode
}
export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const userId = useUserStore((state) => state.id)
  const { showModal, closeModal } = useCustomModal()
  const router = useRouter()
  // eslint-disable-next-line no-undef-init -- it can be uninitialized
  let socket: Socket | undefined = undefined

  const showToast = ({
    toastId,
    title,
    message,
    type = 'info',
    navigationUrl,
    durationMs = 5000,
  }: ToastParams) => {
    const blocking = false
    showModal(toastId, blocking, Toast, {
      title,
      message,
      type,
      onClose: closeModal,
      onClick: navigationUrl ? () => router.push(navigationUrl) : undefined,
      duration: durationMs,
    })
  }

  useEffect(() => {
    if (userId) {
      socket = io(process.env.NEXT_PUBLIC_API_URL)
      socket.emit('register', userId)

      socket.on('recipeAdded', (data) => {
        try {
          const result = NotificationRecipeAddedSchema.parse(data)
          showToast({
            toastId: `NewRecipe-${result.id}`,
            title: `New Recipe from ${result.user.handle}`,
            message: `Click to view: ${result.name}`,
            navigationUrl: `/recipes/${result.id}`,
          })
        } catch (e) {
          console.error(e)
        }
      })
    }

    return () => {
      socket?.off('recipeAdded')
      socket?.disconnect()
    }
  }, [userId])

  return (
    <NotificationContext.Provider value={{ showToast }}>
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
