'use client'

import { ProfilePic } from '@src/components'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { isoDateToLocale } from '@src/utils/stringHelpers'

export interface IRecipeLayoutProps {
  children: React.ReactNode
}
export const RecipeLayout = (props: IRecipeLayoutProps) => {
  const { name, description, user, createdAt } = useRecipeStore(
    (state) => state,
  )

  return (
    <>
      <div className="m-auto max-w-[800px]">
        <h1 className="text-center text-3xl font-bold">{name}</h1>
        <hr className="my-6 h-1 bg-text border-none" />
        <div className="border p-2">
          <h1 className="font-bold">created</h1>
          <div className="px-3">
            <span className="mr-2">by:</span>
            <ProfilePic
              className="inline-block mr-2"
              imageUrl={user.imageUrl}
              handle={user.handle}
            />
            <span>{user.handle}</span>
            <h1>on: {isoDateToLocale(createdAt)}</h1>
          </div>
        </div>
        <p className="my-12 text-center">{description}</p>
      </div>
      <div className="m-auto max-w-[800px]">{props.children}</div>
    </>
  )
}
