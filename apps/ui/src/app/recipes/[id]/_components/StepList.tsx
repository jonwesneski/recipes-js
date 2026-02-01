'use client'

import { mergeCss, Toggle, type ClassValue } from '@repo/design-system'
import { useWakeLock } from '@src/hooks'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import ScaleFactorSelect from './ScaleFactorSelect'
import { Step } from './Step'

interface IStepListProps {
  className?: ClassValue
}
export const StepList = (props: IStepListProps) => {
  const steps = useRecipeStore((state) => state.steps)
  const stepIds = useRecipeStore((state) => state.stepIds)
  const scaleFactor = useRecipeStore((state) => state.metadata.scaleFactor)
  const { isWakeLockSupported, isWakeLockOn, toggleWakeLock } = useWakeLock()

  return (
    <section className={mergeCss(props.className)}>
      <div className="flex flex-wrap justify-center my-10 gap-5">
        {isWakeLockSupported ? (
          <div className="flex items-center">
            <Toggle onClickAsync={toggleWakeLock} initialIsOn={isWakeLockOn} />
            <span className="mt-1 ml-2">Keep screen awake</span>
          </div>
        ) : null}
        <ScaleFactorSelect />
      </div>
      {stepIds.map((id, index) => {
        return (
          <div key={id} className="mb-5">
            <Step
              stepNumber={index + 1}
              stepId={id}
              instruction={steps[id].instruction}
              scaleFactor={scaleFactor}
            />
            {index < stepIds.length - 1 && <hr className="mt-5" />}
          </div>
        )
      })}
    </section>
  )
}
