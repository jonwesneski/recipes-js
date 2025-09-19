'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { type FactorType } from '@src/stores/recipe-store'

// JS doesn't guarantee order of object keys, so we using a tuple instead of a Map
const factorsTuple: [string, FactorType][] = [
  ['1/2', 0.5],
  ['1', 1],
  ['1 1/2', 1.5],
  ['2', 2],
  ['4', 4],
] as const

interface IScaleFactorSelection {
  className?: ClassValue
}
const ScaleFactorSelection = (props: IScaleFactorSelection) => {
  const { scaleFactor, setScaleFactor } = useRecipeStore((state) => state)

  return (
    <div className="border-2">
      <h1 className="text-center font-bold">Scale Factor</h1>
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

export default ScaleFactorSelection
