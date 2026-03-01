'use client'

import { useUsersControllerFollowUserV1 } from '@repo/codegen/users'
import { type ClassValue, mergeCss, TextButton } from '@repo/design-system'
import { useState } from 'react'

interface IFollowButtonProps {
  className?: ClassValue
  userFollowId: string
  amIFollowing: boolean
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
      className={mergeCss('w-28', props.className)}
      text={amIFollowing ? 'unfollow' : 'follow'}
      onClick={handleFollowClick}
    />
  )
}
