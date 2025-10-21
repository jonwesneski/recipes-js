'use client'

import Image from 'next/image'

interface IProfilePicProps {
  imageUrl: string | null
  handle: string
  className?: string
}
export const ProfilePic = (props: IProfilePicProps) => {
  return (
    <Image
      className={props.className}
      src={
        props.imageUrl?.length
          ? props.imageUrl
          : 'https://www.gravatar.com/avatar/?d=mp'
      }
      alt={props.handle}
      priority
      width={30}
      height={30}
    />
  )
}
