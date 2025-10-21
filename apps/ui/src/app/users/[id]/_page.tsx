'use client'

import type {
  RecipeListResponse,
  UserPublicResponse,
} from '@repo/codegen/model'
import { ProfilePic, RecipeList } from '@src/components'

interface IUserPublicProps {
  user: UserPublicResponse
  recipes: RecipeListResponse
}
const UserPublic = ({ user, recipes }: IUserPublicProps) => {
  return (
    <>
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center gap-7 mt-5 border-b-2">
        <div>
          <ProfilePic
            className="inline-block mr-2"
            imageUrl={user.imageUrl}
            handle={user.handle}
          />
          <p>{user.handle}</p>
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
      <section className="mt-10 px-5">
        <RecipeList recipes={recipes} />
      </section>
    </>
  )
}
export default UserPublic
