'use client'

import BookmarkIcon from '@public/bookmark.svg'
import { IconButton } from '@repo/design-system'
import { ProfilePic } from '@src/components'
import { useBookmark } from '@src/hooks/useBookmark'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { type Svg } from '@src/types/svg'
import { isoDateToLocale } from '@src/utils/stringHelpers'
import Link from 'next/link'
import { useEffect } from 'react'

export interface IRecipeLayoutProps {
  children: React.ReactNode
}
export const RecipeLayout = (props: IRecipeLayoutProps) => {
  const { id, name, description, user, createdAt, bookmarked, setBookmarked } =
    useRecipeStore((state) => state)
  const { optimisticIsBookmarked, toggleIsBookmarked } = useBookmark({
    recipeId: id,
    bookmarked: bookmarked ?? false,
  })

  useEffect(() => {
    if (typeof bookmarked === 'boolean') {
      setBookmarked(optimisticIsBookmarked)
    }
  }, [optimisticIsBookmarked])

  return (
    <>
      <div className="m-auto max-w-[800px]">
        <h1 className="text-center text-3xl font-bold">{name}</h1>
        <hr className="my-6 h-1 bg-text border-none" />
        <div className="border p-2">
          <h1 className="font-bold">created</h1>
          <div className="px-3">
            <span className="mr-2">by:</span>
            <div className="relative inline">
              <ProfilePic
                className="inline-block mr-2"
                imageUrl={user.imageUrl}
                handle={user.handle}
              />
              <Link href={`/users/${user.id}`}>
                <span className="absolute inset-0" />
                {user.handle}
              </Link>
            </div>
            <h1>on: {isoDateToLocale(createdAt)}</h1>
          </div>
          <IconButton
            svgIcon={BookmarkIcon as Svg}
            onClick={() => toggleIsBookmarked()}
            svgClassName={optimisticIsBookmarked ? 'fill-text' : undefined}
          />
        </div>
        <p className="my-12 text-center">{description}</p>
      </div>
      <div className="m-auto max-w-[800px]">{props.children}</div>
    </>
  )
}
