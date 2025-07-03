'use client'

import { SharedButton } from '@repo/ui'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { type RefObject } from 'react'
import { IngredientsTextArea } from './IngredientsTextArea'
import { InstructionsTextArea } from './InstructionsTextArea'

export const Steps = () => {
  const { steps, addStep } = useRecipeStore((state) => state)

  const handleOnResize = (
    stepRef: RefObject<HTMLDivElement | null>,
    height: number,
  ) => {
    if (stepRef.current) {
      stepRef.current.style.height = `${height}px`
    }
  }

  return (
    <div>
      {steps.map((s, index) => {
        return (
          <div key={s.id}>
            <h6>Step {index + 1}:</h6>
            <div ref={s.ref} className="flex flex-col md:flex-row">
              <IngredientsTextArea
                ref={s.ingredientsRef}
                onResize={(height: number) => handleOnResize(s.ref, height)}
              />
              <InstructionsTextArea
                ref={s.instructionsRef}
                onResize={(height: number) => handleOnResize(s.ref, height)}
              />
            </div>
          </div>
        )
      })}
      <SharedButton onClick={addStep} text="Add Step" />
    </div>
  )
}
