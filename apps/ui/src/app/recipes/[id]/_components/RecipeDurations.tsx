'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { timeInHourAndMinutes } from '@src/utils/timeHelper'

interface IRecipeDurations {
  className?: ClassValue
}
export const RecipeDurations = (props: IRecipeDurations) => {
  const preparationTimeInMinutes = useRecipeStore(
    (state) => state.preparationTimeInMinutes,
  )
  const cookingTimeInMinutes = useRecipeStore(
    (state) => state.cookingTimeInMinutes,
  )

  return (
    <div
      className={mergeCss(
        'mx-auto max-w-72 table border-collapse',
        props.className,
      )}
    >
      <div className="flex">
        <p className="border p-4 break-all">
          <b>prep time:</b>{' '}
          {timeInHourAndMinutes(preparationTimeInMinutes) ?? '?'}
        </p>
        <p className="border p-4 break-all">
          <b>cook time:</b> {timeInHourAndMinutes(cookingTimeInMinutes) ?? '?'}
        </p>
      </div>
      <div>
        <p className="border p-4 break-all">
          <b>total time:</b>{' '}
          {timeInHourAndMinutes(
            preparationTimeInMinutes,
            cookingTimeInMinutes,
          ) ?? '?'}
        </p>
      </div>
    </div>
  )
}
