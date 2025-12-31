'use client'

import {
  BookmarkButton,
  CopyUrlButton,
  FollowButton,
  ProfilePic,
} from '@src/components'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useUserStore } from '@src/providers/use-store-provider'
import { isoDateToLocale } from '@src/utils/stringHelpers'
import Link from 'next/link'

export interface IRecipeLayoutProps {
  children: React.ReactNode
}
export const RecipeLayout = (props: IRecipeLayoutProps) => {
  const { id: userId } = useUserStore()
  const { id, name, description, user, createdAt, bookmarked, setBookmarked } =
    useRecipeStore((state) => state)

  return (
    <>
      <div className="m-auto max-w-[800px]">
        <h1 className="text-center text-3xl font-bold">{name}</h1>
        <hr className="my-6 h-1 bg-text border-none" />
        <div className="border p-2 flex justify-between items-center">
          <div>
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
                <FollowButton userFollowId={user.id} amIFollowing />
              </div>
              <h1>on: {isoDateToLocale(createdAt)}</h1>
            </div>
          </div>
          <div>
            {userId ? (
              <BookmarkButton
                recipeId={id}
                bookmarked={bookmarked ?? false}
                onToggle={(value) => {
                  if (typeof bookmarked === 'boolean') {
                    setBookmarked(value)
                  }
                }}
              />
            ) : null}
            <CopyUrlButton recipeId={id} />
          </div>
        </div>
        <p className="my-12 text-center">{description}</p>
      </div>
      <div className="m-auto max-w-[800px]">{props.children}</div>
    </>
  )
}
