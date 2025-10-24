'use client'

import BookmarkIcon from '@public/bookmark.svg'
import ClockIcon from '@public/clockIcon.svg'
import ShareIcon from '@public/shareIcon.svg'
import { useRecipesControllerBookmarkRecipeV1 } from '@repo/codegen/recipes'
import { IconButton } from '@repo/design-system'
import { useNotification } from '@src/providers/NotificationProvider'
import { type Svg } from '@src/types/svg'
import { timeInHourAndMinutes } from '@src/utils/timeHelper'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface IRecipeProps {
  id: string
  imageUrl?: string
  name: string
  bookmarked: boolean
  preparationTimeInMinutes: number | null
  cookingTimeInMinutes: number | null
}
export const RecipeTile = (props: IRecipeProps) => {
  const href = `/recipes/${props.id}`
  const [isBookmarked, setIsBookmarked] = useState(props.bookmarked)
  const { showToast } = useNotification()
  const { mutateAsync } = useRecipesControllerBookmarkRecipeV1()

  const handleBookmarkedClick = async () => {
    const bookmark = !isBookmarked
    await mutateAsync({ id: props.id, data: { bookmark } })
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
    <div className="border p-1">
      <div className="relative">
        <div className="relative w-full h-[100px]">
          <Image
            src={
              props.imageUrl?.length
                ? props.imageUrl
                : // TODO: figure out stock image to use here
                  'https://www.gravatar.com/avatar/?d=mp'
            }
            alt={props.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>
        <Link href={href} className="font-bold text-xs">
          <span className="absolute inset-0" />
          {props.name}
        </Link>
      </div>

      <div className="h-6">
        {props.preparationTimeInMinutes && props.cookingTimeInMinutes ? (
          <>
            <ClockIcon className="w-6 h-6 inline mr-1 fill-text" />
            <p className="inline">
              {timeInHourAndMinutes(
                props.preparationTimeInMinutes,
                props.cookingTimeInMinutes,
              )}
            </p>
          </>
        ) : null}
      </div>

      <div className="flex justify-around items-center">
        <IconButton
          svgIcon={BookmarkIcon as Svg}
          onClick={() => void handleBookmarkedClick()}
          svgClassName={isBookmarked ? 'fill-text' : undefined}
        />
        <div className="w-[2px] h-[25px] bg-text" />
        <IconButton
          svgIcon={ShareIcon as Svg}
          onClick={() => void handleCopyClick()}
        />
      </div>
    </div>
  )
}
