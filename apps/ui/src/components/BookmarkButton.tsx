'use client'

import BookmarkIcon from '@public/bookmark.svg'
import { IconButton } from '@repo/design-system'
import { useBookmark } from '@src/hooks/useBookmark'
import type { Svg } from '@src/types/svg'
import { useEffect } from 'react'

interface IBookmarkButtonProps {
  recipeId: string
  bookmarked: boolean
  onToggle?: (_value: boolean) => void
}
export const BookmarkButton = (props: IBookmarkButtonProps) => {
  const { optimisticIsBookmarked, toggleIsBookmarked } = useBookmark({
    recipeId: props.recipeId,
    bookmarked: props.bookmarked,
  })

  useEffect(() => {
    props.onToggle?.(optimisticIsBookmarked)
  }, [optimisticIsBookmarked])

  return (
    <IconButton
      svgIcon={BookmarkIcon as Svg}
      onClick={() => toggleIsBookmarked()}
      svgClassName={optimisticIsBookmarked ? 'fill-text' : undefined}
      aria-label="Bookmark"
    />
  )
}
