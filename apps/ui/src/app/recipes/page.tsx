import type {
  DietsExpressionDto,
  ProteinsExpressionDto,
  RecipeFiltersDto,
} from '@repo/codegen/model'
import { recipesControllerRecipesListV1 } from '@repo/codegen/recipes'
import { RecipeList } from '@src/components'
import { RecipeSearchParamsSchema } from '@src/zod-schemas/recipeSearchParams'

interface IPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}
const Page = async ({ searchParams }: IPageProps) => {
  const params = RecipeSearchParamsSchema.parse(await searchParams)
  const { diets, dietsOperator, proteins, proteinsOperator, ...rest } =
    params.filters ?? {}

  let dietFilters: DietsExpressionDto | undefined
  if (diets) {
    dietFilters = {
      operator: dietsOperator ?? 'AND',
      values: diets,
    }
  }

  let proteinsFilters: ProteinsExpressionDto | undefined
  if (proteins) {
    proteinsFilters = {
      operator: proteinsOperator ?? 'OR',
      values: proteins,
    }
  }

  const filters: RecipeFiltersDto = {
    ...rest,
    diets: dietFilters,
    proteins: proteinsFilters,
  }
  const recipes = await recipesControllerRecipesListV1({
    filters,
  })
  return <RecipeList recipes={recipes} filters={filters} />
}
export default Page
