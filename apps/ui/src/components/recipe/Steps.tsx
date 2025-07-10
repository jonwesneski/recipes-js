'use client'

import { Button } from '@repo/ui'
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
    <div className="mb-10">
      {steps.map((s, index) => {
        return (
          <div key={s.id} className="mb-5">
            <h1 className="font-bold">step {index + 1}.</h1>
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
            {index < steps.length - 1 && <hr className="mt-5" />}
          </div>
        )
      })}
      <Button
        className="float-right"
        variant="opposite"
        text="add step"
        onClick={addStep}
      />
    </div>
  )
}
