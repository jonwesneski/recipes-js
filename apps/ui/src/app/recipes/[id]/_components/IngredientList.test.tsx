import { renderRecipeComponent } from '@src/mocks/renderComponent'
import type { NormalizedRecipe } from '@src/zod-schemas/recipeNormalized'
import IngredientList from './IngredientList'

describe('IngredientList', () => {
  const sampleIngredients = {
    '1': {
      dto: {
        amount: 1,
        name: 'apple',
        unit: 'cups',
        isFraction: false,
      },
      stringValue: '2 cups eggs',
    },
    '2': {
      dto: {
        amount: 2,
        name: 'eggs',
        unit: 'cups',
        isFraction: false,
      },
      stringValue: '2 cups eggs',
    },
  } as NormalizedRecipe['ingredients']
  it('Lists created', async () => {
    const { findByText } = await renderRecipeComponent(
      <IngredientList scaleFactor={1} stepId={'1'} />,
      {
        recipe: {
          ingredients: sampleIngredients,
          steps: {
            '1': {
              ingredientIds: ['1', '2'],
              instruction: null,
              imageUrl: null,
            },
          },
          stepIds: ['1'],
        },
      },
    )
    await findByText(sampleIngredients[1].dto.name)
    await findByText(sampleIngredients[2].dto.name)
  })
})
