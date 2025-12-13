'use client'

import type { UserFollowingsPaginationResponse } from '@repo/codegen/model'
import { useUsersControllerFollowUserV1 } from '@repo/codegen/users'
import { Toggle } from '@repo/design-system'
import { ProfilePic } from '@src/components'
import { useState } from 'react'

interface IAccountProps {
  followings: UserFollowingsPaginationResponse
}
const Followings = (props: IAccountProps) => {
  const [toggleFollowings, setToggleFollowings] = useState<boolean[]>(
    props.followings.data.map(() => true),
  )

  const { mutateAsync: updateFollow } = useUsersControllerFollowUserV1({
    mutation: { retry: false },
  })

  return (
    <>
      {props.followings.data.map((following, i) => (
        <div key={following.id} className="p-2 border-b">
          <div className="flex justify-between">
            <div className="flex">
              <ProfilePic
                className="mr-2"
                handle={following.handle}
                imageUrl={following.imageUrl}
              />
              <span>{following.handle}</span>
            </div>
            <Toggle
              initialIsOn
              onClickAsync={async () => {
                const expected = !toggleFollowings[i]
                await updateFollow({
                  id: following.id,
                  data: { follow: expected },
                })
                setToggleFollowings((prev) => {
                  const newToggles = [...prev]
                  newToggles[i] = expected
                  return newToggles
                })
                return expected
              }}
            />
          </div>
        </div>
      ))}
    </>
  )
}
export default Followings
