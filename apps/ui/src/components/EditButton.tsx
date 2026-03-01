'use client'

import EditIcon from '@public/editIcon.svg'
import { type ClassValue, IconButton } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import type { Svg } from '@src/types/svg'
import { useRouter } from 'next/navigation'

interface IEditRecipeButtonProps {
  className?: ClassValue
}
export const EditRecipeButton = (props: IEditRecipeButtonProps) => {
  const id = useRecipeStore((state) => state.id)
  const router = useRouter()

  return (
    <IconButton
      className={props.className}
      svgIcon={EditIcon as Svg}
      onClick={() => router.push(`/recipes/${id}/edit`)}
      aria-label="Edit Recipe"
    />
  )
}
