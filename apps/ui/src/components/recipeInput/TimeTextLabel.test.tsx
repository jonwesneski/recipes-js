import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimeTextLabel } from './TimeTextLabel'

describe('TimeTextLabel', () => {
  const onChangeMock = jest.fn()

  beforeEach(() => {
    onChangeMock.mockClear()
  })

  it('placeholder', async () => {
    const { findByTestId } = render(
      <TimeTextLabel label="some time" onChange={onChangeMock} />,
    )
    const input = await findByTestId('time-input')
    expect(input.getAttribute('placeholder')).toBe('00:00')
    expect(input).toHaveValue('')
  })

  it('1 minute', async () => {
    const { findByTestId } = render(
      <TimeTextLabel label="some time" onChange={onChangeMock} />,
    )
    const input = await findByTestId('time-input')
    await userEvent.type(input, '1')
    expect(input).toHaveValue('00:01')
  })

  it('10 minute', async () => {
    const { findByTestId } = render(
      <TimeTextLabel label="some time" onChange={onChangeMock} />,
    )
    const input = await findByTestId('time-input')
    await userEvent.type(input, '1')
    await userEvent.type(input, '0')
    expect(input).toHaveValue('00:10')
  })

  it('1 hour 1 minute', async () => {
    const { findByTestId } = render(
      <TimeTextLabel label="some time" onChange={onChangeMock} />,
    )
    const input = await findByTestId('time-input')
    await userEvent.type(input, '1')
    await userEvent.type(input, '0')
    await userEvent.type(input, '1')
    expect(input).toHaveValue('01:01')
    expect(onChangeMock).toHaveBeenCalledTimes(3)
  })

  it('10 hour 10 minute', async () => {
    const { findByTestId } = render(
      <TimeTextLabel label="some time" onChange={onChangeMock} />,
    )
    const input = await findByTestId('time-input')
    await userEvent.type(input, '1')
    await userEvent.type(input, '0')
    await userEvent.type(input, '1')
    await userEvent.type(input, '0')
    expect(input).toHaveValue('10:10')
    expect(onChangeMock).toHaveBeenCalledTimes(4)
  })

  it('back to 1 minute', async () => {
    const { findByTestId } = render(
      <TimeTextLabel label="some time" onChange={onChangeMock} />,
    )
    const input = await findByTestId('time-input')
    await userEvent.type(input, '1')
    await userEvent.type(input, '1')
    await userEvent.type(input, '{backspace}')
    expect(input).toHaveValue('00:01')
    expect(onChangeMock).toHaveBeenCalledTimes(3)
  })

  it('back to nothing', async () => {
    const { findByTestId } = render(
      <TimeTextLabel label="some time" onChange={onChangeMock} />,
    )
    const input = await findByTestId('time-input')
    await userEvent.type(input, '1')
    await userEvent.type(input, '0')
    await userEvent.type(input, '{backspace}{backspace}')
    expect(input).toHaveValue('')
    expect(onChangeMock).toHaveBeenCalledTimes(3)
  })
})
