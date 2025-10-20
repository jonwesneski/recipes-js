import { type IngredientResponse } from '@repo/codegen/model'
import { renderRecipeComponent } from '@src/mocks/renderComponent'
import IngredientList from './IngredientList'

describe('IngredientList', () => {
  const sampleIngredients = [
    {
      amount: 1,
      name: 'apple',
      unit: 'cups',
      createdAt: '',
      updatedAt: '',
      id: '1',
    },
    {
      amount: 2,
      name: 'eggs',
      unit: 'whole',
      createdAt: '',
      updatedAt: '',
      id: '2',
    },
  ] as IngredientResponse[]
  it('Lists created', async () => {
    const { findByText } = renderRecipeComponent(
      <IngredientList scaleFactor={1} ingredients={sampleIngredients} />,
    )
    await findByText(sampleIngredients[0].name)
    await findByText(sampleIngredients[1].name)
  })
})
