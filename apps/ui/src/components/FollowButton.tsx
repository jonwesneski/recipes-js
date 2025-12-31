'use client'

import { useUsersControllerFollowUserV1 } from '@repo/codegen/users'
import { TextButton } from '@repo/design-system'
import { useState } from 'react'

interface IFollowButtonProps {
  userFollowId: string
  amIFollowing: boolean
  //onToggle?: (_value: boolean) => void
}
export const FollowButton = (props: IFollowButtonProps) => {
  const [amIFollowing, setAmIFollowing] = useState<boolean | undefined>(
    props.amIFollowing,
  )
  const { mutate } = useUsersControllerFollowUserV1()

  const handleFollowClick = () => {
    const newValue = !amIFollowing
    mutate(
      { id: props.userFollowId, data: { follow: newValue } },
      {
        onSuccess: () => {
          setAmIFollowing(newValue)
        },
      },
    )
  }

  return (
    <TextButton
      className="w-28"
      text={amIFollowing ? 'unfollow' : 'follow'}
      onClick={handleFollowClick}
    />
  )
}
