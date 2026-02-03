'use client'

import ClockIcon from '@public/clockIcon.svg'
import type { RecipeMinimalResponse } from '@repo/codegen/model'
import { useUserStore } from '@src/providers/use-store-provider'
import { timeInHourAndMinutes } from '@src/utils/timeHelper'
import Image from 'next/image'
import Link from 'next/link'
import { type Ref } from 'react'
import { BookmarkButton } from './BookmarkButton'
import { CopyUrlButton } from './CopyUrlButton'

interface IRecipeProps {
  recipe: RecipeMinimalResponse
  innerRef?: Ref<HTMLDivElement>
}
export const RecipeCard = (props: IRecipeProps) => {
  const href = `/recipes/${props.recipe.id}`

  const { id: userId } = useUserStore()

  return (
    <div ref={props.innerRef} className="custom-shadow-all">
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
        <Link href={href} className="px-2 font-bold text-xs">
          <span className="absolute inset-0" />
          {props.recipe.name}
        </Link>
      </div>

      <div className="px-2">
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
            <BookmarkButton
              recipeId={props.recipe.id}
              bookmarked={props.recipe.bookmarked ?? false}
            />
          ) : (
            <div className="w-8 h-8" />
          )}

          <div className="w-[2px] h-[25px] bg-text" />
          <CopyUrlButton recipeId={props.recipe.id} />
        </div>
      </div>
    </div>
  )
}
