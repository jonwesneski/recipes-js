import { type IngredientEntity } from '@repo/codegen/model'
import { renderComponent } from '@src/mocks/renderComponent'
import { IngredientList } from './IngredientList'

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
  ] as IngredientEntity[]
  it('Lists created', async () => {
    const { findByText } = renderComponent(
      <IngredientList ingredients={sampleIngredients} />,
    )
    await findByText(sampleIngredients[0].name)
    await findByText(sampleIngredients[1].name)
  })
})
