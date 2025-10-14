'use client'

import { useCustomModal } from '@repo/design-system'
import { NotificationRecipeAddedSchema } from '@repo/zod-schemas'
import Toast, { type ToastType } from '@src/components/ToastComponent'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { io, type Socket } from 'socket.io-client'
import { useUserStore } from './use-store-provider'

export type NotificationType = {
  showToast: (_toastId: string, _title: string, _message: string) => void
}
export const NotificationContext = createContext<NotificationType | null>(null)

const TOAST_DURATION_MS = 5000

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
  let toastTimer: ReturnType<typeof setTimeout>

  const showToast = (
    toastId: string,
    title: string,
    message: string,
    type: ToastType = 'info',
    navigationUrl?: string,
  ) => {
    toastTimer = setTimeout(closeModal, TOAST_DURATION_MS)
    showModal(toastId, Toast, {
      title,
      message,
      type,
      onClose: closeModal,
      onClick: navigationUrl ? () => router.push(navigationUrl) : undefined,
      animationDuration: TOAST_DURATION_MS,
    })
  }

  useEffect(() => {
    if (userId) {
      socket = io(process.env.NEXT_PUBLIC_API_URL)
      socket.emit('register', userId)

      socket.on('recipeAdded', (_data) => {
        try {
          const result = NotificationRecipeAddedSchema.parse(_data)
          showToast(
            `NewRecipe-${result.id}`,
            `New Recipe from ${result.user.handle}`,
            result.name,
            'info',
            `/recipes/${result.id}`,
          )
        } catch (e) {
          console.error(e)
        }
      })
    }

    return () => {
      clearTimeout(toastTimer)
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
