'use client'

import { mergeCss, type ClassValue } from '@repo/design-system'
import { useState } from 'react'

const factors = ['1/2', '1', '1 1/2', '2', '4'] as const
type FactorType = (typeof factors)[number]

interface IScaleFactorSelection {
  className?: ClassValue
  onClick: (_factor: FactorType) => void
}
const ScaleFactorSelection = (props: IScaleFactorSelection) => {
  const [selectedFactor, setSelectedFactor] = useState<FactorType>('1')

  const handleFactorClick = (portion: FactorType) => {
    setSelectedFactor(portion)
    props.onClick(portion)
  }

  return (
    <div className="border-2">
      <h1 className="text-center font-bold">Scale Factor</h1>
      <div className="flex divide-x divide-text">
        {factors.map((p) => {
          return (
            <button
              key={p}
              type="button"
              className={mergeCss(
                'p-2',
                {
                  'bg-text text-background': p === selectedFactor,
                  'hover:bg-(--text) hover:text-(--background) cursor-pointer':
                    p !== selectedFactor,
                },
                props.className,
              )}
              onClick={() => handleFactorClick(p)}
            >{`${p}x`}</button>
          )
        })}
      </div>
    </div>
  )
}

export default ScaleFactorSelection
