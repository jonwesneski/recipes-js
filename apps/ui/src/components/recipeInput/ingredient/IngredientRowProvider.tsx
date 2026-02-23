'use client'

import { type MeasurementUnitType } from '@src/utils/measurements'
import { type NormalizedIngredient } from '@src/zod-schemas/recipeNormalized'
import { createContext, useContext, type ReactNode } from 'react'
import { type DropdownMode } from './IngredientDropdown'

export type IngredientRowType = {
  ingredient: NormalizedIngredient
  caretIndex: number
  dropdownMode: DropdownMode | null
  onAmountChange: (_value: string, _newCaretIndex: number) => void
  onMeasurementChange: (_value: MeasurementUnitType) => void
  onNameClick: (_value: string) => void
  onBlur: () => void
  onModeChange: (_mode: DropdownMode) => void
}
export const IngredientRowContext = createContext<IngredientRowType | null>(null)

export interface IngredientRowProviderProps {
  children: ReactNode
  value: IngredientRowType
}
export const IngredientRowProvider = ({
  children,
  value,
}: IngredientRowProviderProps) => {
  return (
    <IngredientRowContext.Provider value={value}>
      {children}
    </IngredientRowContext.Provider>
  )
}

export const useIngredientRow = () => {
  const context = useContext(IngredientRowContext)
  if (!context) {
    throw new Error(
      `${useIngredientRow.name} must be used within a ${IngredientRowProvider.name}`,
    )
  }
  return context
}
