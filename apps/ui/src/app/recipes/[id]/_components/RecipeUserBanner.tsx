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

export const RecipeUserBanner = () => {
  const { id: userId } = useUserStore()
  const { id, user, createdAt, bookmarked, setBookmarked } = useRecipeStore(
    (state) => state,
  )

  return (
    <div className="border p-2 flex justify-between items-center">
      <div>
        <p className="font-bold">created</p>
        <div className="px-3">
          <span className="mr-2 font-bold">by:</span>
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
            {typeof user.amIFollowing === 'boolean' ? (
              <FollowButton
                userFollowId={user.id}
                amIFollowing={user.amIFollowing}
              />
            ) : null}
          </div>
          <span className="mr-2 font-bold">on:</span>
          <span>{isoDateToLocale(createdAt)}</span>
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
  )
}
