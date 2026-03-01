'use client'

import DeleteIcon from '@public/deleteIcon.svg'
import { useRecipesControllerDeleteRecipeV1 } from '@repo/codegen/recipes'
import {
  type ClassValue,
  IconButton,
  ModalQuestion,
  useCustomModal,
} from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import type { Svg } from '@src/types/svg'
import { useRouter } from 'next/navigation'

interface IDeleteRecipeButtonProps {
  className?: ClassValue
}
export const DeleteRecipeButton = (props: IDeleteRecipeButtonProps) => {
  const id = useRecipeStore((state) => state.id)
  const { showModal, closeModal } = useCustomModal()
  const router = useRouter()

  const { mutate } = useRecipesControllerDeleteRecipeV1({
    mutation: { retry: false },
  })

  const handleOnDelete = () => {
    mutate(
      { id },
      {
        onSuccess: () => {
          closeModal()
          router.replace('/recipes')
        },
      },
    )
  }

  const handleOnClick = () => {
    const blocking = true
    showModal(
      'Delete Recipe',
      blocking,
      () => (
        <ModalQuestion
          question="are you sure you want to delete this recipe?"
          action="delete"
          noAction="no"
          onTakeAction={handleOnDelete}
          onDontTakeAction={closeModal}
        />
      ),
      {},
    )
  }

  return (
    <IconButton
      className={props.className}
      svgIcon={DeleteIcon as Svg}
      onClick={handleOnClick}
      aria-label="Delete Recipe"
    />
  )
}
