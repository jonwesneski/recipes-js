'use client'

import { Toggle } from '@repo/design-system'
import useWakeLock from '@src/hooks/useWakeLock'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { isoDateToLocale } from '@src/utils/stringHelpers'
import Image from 'next/image'

export interface IRecipeLayoutProps {
  children: React.ReactNode
}
export const RecipeLayout = (props: IRecipeLayoutProps) => {
  const { name, description, user, createdAt } = useRecipeStore(
    (state) => state,
  )
  const { isWakeLockSupported, isWakeLockOn, toggleWakeLock } = useWakeLock()

  return (
    <>
      <div className="m-auto max-w-[800px]">
        <h1 className="text-center text-3xl font-bold">{name}</h1>
        <hr className="my-6 h-1 bg-text border-none" />
        <div className="border p-2">
          <h1 className="font-bold">created</h1>
          <div className="px-3">
            <span className="mr-2">by:</span>
            <Image
              className="inline-block mr-2"
              src={user.imageUrl ?? ''}
              alt={user.handle}
              priority
              width={30}
              height={30}
            />
            <span>{user.handle}</span>
            <h1>on: {isoDateToLocale(createdAt)}</h1>
          </div>
        </div>
        <p className="my-12 text-center">{description}</p>
      </div>
      {isWakeLockSupported ? (
        <div className="flex items-center">
          <Toggle onClickAsync={toggleWakeLock} initialIsOn={isWakeLockOn} />
          <span className="mt-1 ml-2">Keep screen awake</span>
        </div>
      ) : null}

      <main className="m-auto max-w-[800px]">{props.children}</main>
    </>
  )
}
