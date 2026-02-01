'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { type FactorType } from '@src/stores/recipeStore'

// JS doesn't guarantee order of object keys, so using a tuple instead of a Map
const factorsTuple: [string, FactorType][] = [
  ['1/2', 0.5],
  ['1', 1],
  ['1 1/2', 1.5],
  ['2', 2],
  ['4', 4],
] as const

interface IScaleFactorSelectProps {
  className?: ClassValue
}
const ScaleFactorSelect = (props: IScaleFactorSelectProps) => {
  const setScaleFactor = useRecipeStore((state) => state.setScaleFactor)
  const scaleFactor = useRecipeStore((state) => state.metadata.scaleFactor)

  return (
    <div className="border-2">
      <p className="text-center font-bold">Scale Factor</p>
      <div className="flex divide-x divide-text">
        {factorsTuple.map((f) => {
          return (
            <button
              key={f[0]}
              type="button"
              className={mergeCss(
                'p-2',
                {
                  'bg-text text-background': f[1] === scaleFactor,
                  'hover:bg-(--text) hover:text-(--background) cursor-pointer':
                    f[1] !== scaleFactor,
                },
                props.className,
              )}
              onClick={() => setScaleFactor(f[1])}
            >{`${f[0]}x`}</button>
          )
        })}
      </div>
    </div>
  )
}

export default ScaleFactorSelect
