'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { timeInHourAndMinutes } from '@src/utils/timeHelper'

interface IRecipeDurations {
  className?: ClassValue
}
export const RecipeDurations = (props: IRecipeDurations) => {
  const { preparationTimeInMinutes, cookingTimeInMinutes } = useRecipeStore(
    (state) => state,
  )

  return (
    <table className={mergeCss('mx-auto min-w-96', props.className)}>
      <tbody>
        <tr>
          <td className="border p-4">
            prep time: {timeInHourAndMinutes(preparationTimeInMinutes) ?? '?'}
          </td>
          <td className="border p-4">
            cook time: {timeInHourAndMinutes(cookingTimeInMinutes) ?? '?'}
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center" colSpan={2}>
            total time:{' '}
            {timeInHourAndMinutes(
              preparationTimeInMinutes,
              cookingTimeInMinutes,
            ) ?? '?'}
          </td>
        </tr>
      </tbody>
    </table>
  )
}
