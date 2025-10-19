'use client'

import type {
  RecipeListResponse,
  UserPublicResponse,
} from '@repo/codegen/model'
import { RecipeList } from '@src/components'
import Image from 'next/image'

interface IUserPublicProps {
  user: UserPublicResponse
  recipes: RecipeListResponse
}
const UserPublic = ({ user, recipes }: IUserPublicProps) => {
  return (
    <>
      <div className="flex justify-center gap-7 mt-5 border-b-2">
        <div>
          <Image
            className="inline-block mr-2"
            src={
              user.imageUrl?.length
                ? user.imageUrl
                : 'https://www.gravatar.com/avatar/?d=mp'
            }
            alt={user.handle}
            priority
            width={30}
            height={30}
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
