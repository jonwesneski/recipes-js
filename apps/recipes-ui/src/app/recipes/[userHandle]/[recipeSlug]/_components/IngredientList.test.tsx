import { type IngredientEntity } from '@repo/recipes-codegen/model'
import { ModalStoreProvider } from '@repo/ui'
import { UserStoreProvider } from '@src/providers/use-store-provider'
import { render } from '@testing-library/react'
import React from 'react'
import { IngredientList } from './IngredientList'

const renderComponent = (ui: React.ReactNode) => {
  return render(
    <UserStoreProvider>
      <ModalStoreProvider>{ui}</ModalStoreProvider>
    </UserStoreProvider>,
  )
}

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
