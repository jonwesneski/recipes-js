'use client'

import ShareIcon from '@public/share.svg'
import StarIcon from '@public/star.svg'
import StarredIcon from '@public/starred.svg'
import { IconButton } from '@repo/design-system'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface IRecipeProps {
  href: string
  imageUrl?: string
  name: string
  starred: boolean
}
export const RecipeTile = (props: IRecipeProps) => {
  const [isStarred, setIsStarred] = useState(props.starred)

  const handleStarredClick = () => {
    setIsStarred((v) => !v)
  }

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${props.href}`,
      )
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="border p-1">
      <div className="relative">
        <div className="relative w-full h-[100px]">
          <Image
            src={
              props.imageUrl?.length
                ? props.imageUrl
                : // TODO: figure out stock image to use here
                  'https://www.gravatar.com/avatar/?d=mp'
            }
            alt={props.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>
        <Link href={props.href} className="font-bold text-xs">
          <span className="absolute inset-0" />
          {props.name}
        </Link>
      </div>
      <div className="flex justify-around items-center">
        <IconButton
          imageUrl={(isStarred ? StarredIcon : StarIcon) as string}
          altText="save recipe"
          onClick={handleStarredClick}
        />
        <div className="w-[2px] h-[25px] bg-black" />
        <IconButton
          imageUrl={ShareIcon as string}
          altText="share recipe"
          onClick={() => void handleCopyClick()}
        />
      </div>
    </div>
  )
}
