import { ModalStoreProvider } from '@repo/ui'
import { AuthenticationProvider } from '@src/providers/authentication-provider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'
import { UserStoreProvider } from '@src/providers/use-store-provider'
import { type RecipeStore } from '@src/stores/recipe-store'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Steps } from './Steps'

const INGREDIENTS_ID = 'ingredients-text-area'
const INSTRUCTIONS_ID = 'instructions-text-area'

const ingredientsString = '2 cups flour\n\n1 ounces sugar\n\n2 grams paste'
const instructionsString = 'my second step\n\nmy third step\n\nmy fourth step'

const renderComponent = (
  ui: React.ReactNode,
  initialState?: Partial<RecipeStore>,
) => {
  return render(
    <AuthenticationProvider>
      <UserStoreProvider>
        <ModalStoreProvider>
          <RecipeStoreProvider initialState={initialState}>
            {ui}
          </RecipeStoreProvider>
        </ModalStoreProvider>
      </UserStoreProvider>
    </AuthenticationProvider>,
  )
}

describe('Steps', () => {
  describe('On New', () => {
    it('Initial Load', async () => {
      const { findAllByTestId } = renderComponent(<Steps />)
      const ingredients = await findAllByTestId(INGREDIENTS_ID)
      const instructions = await findAllByTestId(INSTRUCTIONS_ID)
      expect(ingredients.length).toBe(1)
      expect(instructions.length).toBe(1)
    })

    it('Pasting ingredients: Windows', async () => {
      const dataList = ingredientsString
        .replaceAll('\n\n', '\r\n\r\n')
        .split('\r\n\r\n')
      const { findAllByTestId } = renderComponent(<Steps />)
      let ingredients = await findAllByTestId(INGREDIENTS_ID)

      ingredients[0].focus()
      await userEvent.paste(ingredientsString)

      ingredients = await findAllByTestId(INGREDIENTS_ID)
      expect(ingredients.length).toBe(3)
      ingredients.forEach((i, index) => {
        expect(i.textContent).toBe(dataList[index])
      })

      const instructions = await findAllByTestId(INSTRUCTIONS_ID)
      expect(instructions.length).toBe(3)
      instructions.forEach((i) => {
        expect(i.textContent).toBe('')
      })
    })

    it('Pasting ingredients: Linux', async () => {
      const dataList = ingredientsString.split('\n\n')
      const { findAllByTestId } = renderComponent(<Steps />)
      let ingredients = await findAllByTestId(INGREDIENTS_ID)

      ingredients[0].focus()
      await userEvent.paste(ingredientsString)

      ingredients = await findAllByTestId(INGREDIENTS_ID)
      expect(ingredients.length).toBe(3)
      ingredients.forEach((i, index) => {
        expect(i.textContent).toBe(dataList[index])
      })

      const instructions = await findAllByTestId(INSTRUCTIONS_ID)
      expect(instructions.length).toBe(3)
      instructions.forEach((i) => {
        expect(i.textContent).toBe('')
      })
    })

    it('Pasting instructions: Windows', async () => {
      const dataList = instructionsString
        .replaceAll('\n\n', '\r\n\r\n')
        .split('\r\n\r\n')
      const { findAllByTestId } = renderComponent(<Steps />)
      let instructions = await findAllByTestId(INSTRUCTIONS_ID)

      instructions[0].focus()
      await userEvent.paste(instructionsString)

      instructions = await findAllByTestId(INSTRUCTIONS_ID)
      expect(instructions.length).toBe(3)
      instructions.forEach((i, index) => {
        expect(i.textContent).toBe(dataList[index])
      })

      const ingredients = await findAllByTestId(INGREDIENTS_ID)
      expect(ingredients.length).toBe(3)
      ingredients.forEach((i) => {
        expect(i.textContent).toBe('')
      })
    })

    it('Pasting instructions: Linux', async () => {
      const dataList = instructionsString.split('\n\n')
      const { findAllByTestId } = renderComponent(<Steps />)
      let instructions = await findAllByTestId(INSTRUCTIONS_ID)

      instructions[0].focus()
      await userEvent.paste(instructionsString)

      instructions = await findAllByTestId(INSTRUCTIONS_ID)
      expect(instructions.length).toBe(3)
      instructions.forEach((i, index) => {
        expect(i.textContent).toBe(dataList[index])
      })

      const ingredients = await findAllByTestId(INGREDIENTS_ID)
      expect(ingredients.length).toBe(3)
      ingredients.forEach((i) => {
        expect(i.textContent).toBe('')
      })
    })

    it('Pasting uneven steps', async () => {
      const ingredientsList = ingredientsString.split('\n\n')
      const instructionsList = instructionsString.split('\n\n')
      const { findAllByTestId } = renderComponent(<Steps />)
      let ingredients = await findAllByTestId(INGREDIENTS_ID)

      ingredients[0].focus()
      await userEvent.paste(ingredientsString)
      let instructions = await findAllByTestId(INSTRUCTIONS_ID)
      instructions[1].focus()
      await userEvent.paste(instructionsString)

      ingredients = await findAllByTestId(INGREDIENTS_ID)
      expect(ingredients.length).toBe(4)
      ingredients.forEach((i, index) => {
        if (index === 3) {
          expect(i.textContent).toBe('')
          return
        }
        expect(i.textContent).toBe(ingredientsList[index])
      })

      instructions = await findAllByTestId(INSTRUCTIONS_ID)
      expect(instructions.length).toBe(4)
      instructions.forEach((i, index) => {
        if (index === 0) {
          expect(i.textContent).toBe('')
          return
        }
        expect(i.textContent).toBe(instructionsList[index - 1])
      })
    })
  })
})
