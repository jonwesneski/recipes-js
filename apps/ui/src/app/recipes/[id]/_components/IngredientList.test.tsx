import { renderRecipeComponent } from '@src/mocks/renderComponent'
import type { NormalizedRecipe } from '@src/zod-schemas/recipeNormalized'
import IngredientList from './IngredientList'

describe('IngredientList', () => {
  const sampleIngredients = {
    '1': {
      amount: { value: 1, display: '1' },
      isFraction: false,
      unit: { value: 'cups', display: 'cups' },
      name: { value: 'apple', display: 'apple' },
    },
    '2': {
      amount: { value: 2, display: '2' },
      isFraction: false,
      unit: { value: 'cups', display: 'cups' },
      name: { value: 'eggs', display: 'eggs' },
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
    await findByText(sampleIngredients[1].name.value)
    await findByText(sampleIngredients[2].name.value)
  })
})
