import React from 'react';
import {render} from '@testing-library/react'
import IngredientList from './IngredientList'
import { UserStoreProvider } from '../../../../providers/use-store-provider';
import { ModalStoreProvider } from '../../../../providers/modal-store-provider';



const renderComponent = (ui: React.ReactNode) => {
  return render(
    <UserStoreProvider>
      <ModalStoreProvider>
        {ui}
      </ModalStoreProvider>
    </UserStoreProvider>
  )
};

describe('IngredientList', () => {



  const sampleIngredients = [
    {amount: 1, name: 'apple', unit: 'cups', createdAt: '', updatedAt: '', id: '1'},
    {amount: 2, name: 'eggs', unit: '', createdAt: '', updatedAt: '', id: '2'}
  ]
  it('Lists created', async () => {
    const {findByText} = renderComponent(<IngredientList ingredients={sampleIngredients}/>)
    await findByText(sampleIngredients[0].name)
    await findByText(sampleIngredients[1].name)
  })
})