import { renderRecipeComponent } from '@src/mocks/renderComponent'
import userEvent from '@testing-library/user-event'
import { Steps } from './Steps'

jest.mock('jwt-decode', () => ({
  default: () => ({}),
  jwtDecode: () => {
    return {
      sub: '1234',
      email: 'test@email.com',
      handle: '123',
    }
  },
}))
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(global, 'localStorage', { value: localStorageMock })
localStorageMock.getItem.mockImplementation(() => 'jwtvalue')

const INGREDIENT_ID = 'ingredient-text-area'
const INSTRUCTIONS_ID = 'instructions-text-area'

const ingredientsString = '2 cups flour\n\n1 ounces sugar\n\n2 grams paste'
const instructionsString = 'my second step\n\nmy third step\n\nmy fourth step'

describe('Steps', () => {
  describe('On New', () => {
    it('Initial Load', async () => {
      const { findAllByTestId } = renderRecipeComponent(<Steps />)
      const ingredients = await findAllByTestId(INGREDIENT_ID)
      const instructions = await findAllByTestId(INSTRUCTIONS_ID)
      expect(ingredients.length).toBe(1)
      expect(instructions.length).toBe(1)
    })

    it.only('Pasting ingredients: Windows', async () => {
      const ingredientsStringFromWindows = ingredientsString.replaceAll(
        '\n\n',
        '\r\n\r\n',
      )
      const dataList = ingredientsStringFromWindows.split('\r\n\r\n')
      const { findAllByTestId } = renderRecipeComponent(<Steps />)
      let ingredients = await findAllByTestId(INGREDIENT_ID)

      ingredients[0].focus()
      await userEvent.paste(ingredientsStringFromWindows)

      ingredients = await findAllByTestId(INGREDIENT_ID)
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
      const { findAllByTestId } = renderRecipeComponent(<Steps />)
      let ingredients = await findAllByTestId(INGREDIENT_ID)

      ingredients[0].focus()
      await userEvent.paste(ingredientsString)

      ingredients = await findAllByTestId(INGREDIENT_ID)
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
      const instructionStringFromWindows = ingredientsString.replaceAll(
        '\n\n',
        '\r\n\r\n',
      )
      const dataList = instructionStringFromWindows.split('\r\n\r\n')
      const { findAllByTestId } = renderRecipeComponent(<Steps />)
      let instructions = await findAllByTestId(INSTRUCTIONS_ID)

      instructions[0].focus()
      await userEvent.paste(instructionStringFromWindows)

      instructions = await findAllByTestId(INSTRUCTIONS_ID)
      expect(instructions.length).toBe(3)
      instructions.forEach((i, index) => {
        expect(i.textContent).toBe(dataList[index])
      })

      const ingredients = await findAllByTestId(INGREDIENT_ID)
      expect(ingredients.length).toBe(3)
      ingredients.forEach((i) => {
        expect(i.textContent).toBe('')
      })
    })

    it('Pasting instructions: Linux', async () => {
      const dataList = instructionsString.split('\n\n')
      const { findAllByTestId } = renderRecipeComponent(<Steps />)
      let instructions = await findAllByTestId(INSTRUCTIONS_ID)

      instructions[0].focus()
      await userEvent.paste(instructionsString)

      instructions = await findAllByTestId(INSTRUCTIONS_ID)
      expect(instructions.length).toBe(3)
      instructions.forEach((i, index) => {
        expect(i.textContent).toBe(dataList[index])
      })

      const ingredients = await findAllByTestId(INGREDIENT_ID)
      expect(ingredients.length).toBe(3)
      ingredients.forEach((i) => {
        expect(i.textContent).toBe('')
      })
    })

    it('Pasting uneven steps', async () => {
      const ingredientsList = ingredientsString.split('\n\n')
      const instructionsList = instructionsString.split('\n\n')
      const { findAllByTestId } = renderRecipeComponent(<Steps />)
      let ingredients = await findAllByTestId(INGREDIENT_ID)

      ingredients[0].focus()
      await userEvent.paste(ingredientsString)
      let instructions = await findAllByTestId(INSTRUCTIONS_ID)
      instructions[1].focus()
      await userEvent.paste(instructionsString)

      ingredients = await findAllByTestId(INGREDIENT_ID)
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
