'use client'

import BookmarkIcon from '@public/bookmark.svg'
import ClockIcon from '@public/clockIcon.svg'
import ShareIcon from '@public/shareIcon.svg'
import type { RecipeMinimalResponse } from '@repo/codegen/model'
import { useRecipesControllerBookmarkRecipeV1 } from '@repo/codegen/recipes'
import { IconButton } from '@repo/design-system'
import { useNotification } from '@src/providers/NotificationProvider'
import { useUserStore } from '@src/providers/use-store-provider'
import { type Svg } from '@src/types/svg'
import { timeInHourAndMinutes } from '@src/utils/timeHelper'
import Image from 'next/image'
import Link from 'next/link'
import { type Ref, useState } from 'react'

interface IRecipeProps {
  recipe: RecipeMinimalResponse
  innerRef?: Ref<HTMLDivElement>
}
export const RecipeTile = (props: IRecipeProps) => {
  const href = `/recipes/${props.recipe.id}`
  const [isBookmarked, setIsBookmarked] = useState(props.recipe.bookmarked)
  const { showToast } = useNotification()
  const userId = useUserStore((state) => state.id)
  const { mutateAsync } = useRecipesControllerBookmarkRecipeV1()

  const handleBookmarkedClick = async () => {
    const bookmark = !isBookmarked
    await mutateAsync({ id: props.recipe.id, data: { bookmark } })
    setIsBookmarked(bookmark)
  }

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
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div ref={props.innerRef} className="border p-1">
      <div className="relative">
        <div className="relative w-full h-[100px]">
          <Image
            src={
              props.recipe.imageUrl?.length
                ? props.recipe.imageUrl
                : // TODO: figure out stock image to use here
                  'https://www.gravatar.com/avatar/?d=mp'
            }
            alt={props.recipe.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>
        <Link href={href} className="font-bold text-xs">
          <span className="absolute inset-0" />
          {props.recipe.name}
        </Link>
      </div>

      <div className="h-6">
        {props.recipe.preparationTimeInMinutes &&
        props.recipe.cookingTimeInMinutes ? (
          <>
            <ClockIcon className="w-6 h-6 inline mr-1 fill-text" />
            <p className="inline">
              {timeInHourAndMinutes(
                props.recipe.preparationTimeInMinutes,
                props.recipe.cookingTimeInMinutes,
              )}
            </p>
          </>
        ) : null}
      </div>

      <div className="flex justify-around items-center">
        {userId ? (
          <IconButton
            svgIcon={BookmarkIcon as Svg}
            onClick={() => void handleBookmarkedClick()}
            svgClassName={isBookmarked ? 'fill-text' : undefined}
          />
        ) : (
          <div className="w-8 h-8" />
        )}

        <div className="w-[2px] h-[25px] bg-text" />
        <IconButton
          svgIcon={ShareIcon as Svg}
          onClick={() => void handleCopyClick()}
        />
      </div>
    </div>
  )
}
