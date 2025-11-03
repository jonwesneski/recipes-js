'use client'

import type { RecipeFiltersDto, RecipeListResponse } from '@repo/codegen/model'
import { recipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { useRecipesListStore } from '@src/providers/recipes-list-store-provider'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { RecipeTile } from './RecipeTile'

interface IRecipesListProps {
  recipes: RecipeListResponse
  filters?: RecipeFiltersDto
}
export const RecipeList = (props: IRecipesListProps) => {
  const { recipes, setRecipes, appendRecipes } = useRecipesListStore()
  const { ref, inView } = useInView({
    threshold: 0.1,
  })

  useEffect(() => {
    setRecipes(props.recipes)
  }, [])

  const { fetchNextPage, hasNextPage, data } = useInfiniteQuery({
    queryKey: ['recipes'],
    queryFn: ({ pageParam }: { pageParam?: string | undefined }) => {
      return recipesControllerRecipesListV1({
        filters: props.filters,
        pagination: { cursorId: pageParam },
      })
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  })

  useEffect(() => {
    if (inView) {
      fetchNextPage().catch((e: unknown) => console.error(e))
    }
  }, [inView, fetchNextPage])

  useEffect(() => {
    if (data && data.pages.length > 0) {
      appendRecipes(data.pages[0])
    }
  }, [data])

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3"
    >
      {recipes.map((recipe, index) => (
        <RecipeTile
          innerRef={recipes.length - index < 3 && hasNextPage ? ref : undefined}
          key={recipe.id}
          recipe={recipe}
        />
      ))}
    </div>
  )
}
