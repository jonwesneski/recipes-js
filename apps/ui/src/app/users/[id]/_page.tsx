'use client'

import type {
  RecipeListResponse,
  UserPublicResponse,
} from '@repo/codegen/model'
import { useUsersControllerFollowUserV1 } from '@repo/codegen/users'
import { TextButton } from '@repo/design-system'
import { ProfilePic, RecipeList } from '@src/components'
import { useState } from 'react'

interface IUserPublicProps {
  user: UserPublicResponse
  recipes: RecipeListResponse
}
const UserPublic = ({ user, recipes }: IUserPublicProps) => {
  const [amIFollowing, setAmIFollowing] = useState<boolean | undefined>(
    user.amIFollowing,
  )
  const { mutate } = useUsersControllerFollowUserV1()

  const handleFollowClick = () => {
    const newValue = !amIFollowing
    mutate(
      { id: user.id, data: { follow: newValue } },
      {
        onSuccess: () => {
          setAmIFollowing(newValue)
        },
      },
    )
  }
  return (
    <>
      <div className="fixed top-0 left-1/2 md:pt-30 -translate-x-1/2 z-10 w-full flex justify-center gap-7 border-b-2 pb-5">
        <div>
          <ProfilePic
            className="inline-block mr-2"
            imageUrl={user.imageUrl}
            handle={user.handle}
          />
          <p>{user.handle}</p>
          {typeof amIFollowing === 'boolean' ? (
            <TextButton
              className="w-28"
              text={amIFollowing ? 'unfollow' : 'follow'}
              onClick={handleFollowClick}
            />
          ) : null}
        </div>
        <div>
          <div className="flex justify-center mb-5">
            <span className="font-bold">total recipes: </span>
            <span>{user.recipes}</span>
          </div>
          <div className="flex gap-5">
            <div>
              <span className="font-bold">follwers: </span>
              <span>{user.followers}</span>
            </div>
            <div>
              <span className="font-bold">following: </span>
              <span>{user.followings}</span>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-36 px-5">
        <RecipeList recipes={recipes} />
      </section>
    </>
  )
}
export default UserPublic
