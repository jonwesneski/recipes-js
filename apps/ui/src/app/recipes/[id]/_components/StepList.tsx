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
  const { steps, scaleFactor } = useRecipeStore((state) => state)
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
      {steps.map((s, index) => {
        return (
          <div key={s.keyId} className="mb-5">
            <Step stepNumber={index + 1} step={s} scaleFactor={scaleFactor} />
            {index < steps.length - 1 && <hr className="mt-5" />}
          </div>
        )
      })}
    </section>
  )
}
