'use client'

import ShareIcon from '@public/shareIcon.svg'
import { IconButton } from '@repo/design-system'
import { useNotification } from '@src/providers/NotificationProvider'
import type { Svg } from '@src/types/svg'

interface ICopyUrlButtonProps {
  recipeId: string
}
export const CopyUrlButton = (props: ICopyUrlButtonProps) => {
  const href = `/recipes/${props.recipeId}`

  const { showToast } = useNotification()

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${href}`)
      showToast({
        title: 'copied!',
        message: '',
        toastId: 'copied-recipe-url',
        durationMs: 800,
      })
    } catch (err) {
      showToast({
        title: 'Error',
        message: 'failed to copy',
        toastId: 'error-copied-recipe-url',
        durationMs: 800,
        type: 'error',
      })
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <IconButton
      svgIcon={ShareIcon as Svg}
      onClick={() => void handleCopyClick()}
    />
  )
}
