'use client'

import { type ClassValue, mergeCss } from '@repo/design-system'
import { useRecipeStore } from '@src/providers/recipe-store-provider'
import { useUserStore } from '@src/providers/use-store-provider'
import { calculatePercentage, roundToDecimal } from '@src/utils/calculate'
import { type nutritionalFactsConst } from '@src/utils/nutritionalFacts'
import { type JSX } from 'react'

type NutrientKey = keyof typeof nutritionalFactsConst

interface INutritionalFactsProps {
  className?: ClassValue
}

interface NutrientRowConfig {
  key: NutrientKey
  label: string | JSX.Element
  unit: string
  bold: boolean
  indent: boolean
  showDV: boolean
}

interface VitaminConfig {
  key: NutrientKey
  label: string
  unit: string
}

const MAIN_ROWS: NutrientRowConfig[] = [
  {
    key: 'saturatedFatInG',
    label: 'Saturated Fat',
    unit: 'g',
    bold: false,
    indent: true,
    showDV: true,
  },
  {
    key: 'transFatInG',
    label: (
      <>
        <em>Trans</em>
        {' Fat'}
      </>
    ),
    unit: 'g',
    bold: false,
    indent: true,
    showDV: false,
  },
  {
    key: 'polyunsaturatedFatInG',
    label: 'Polyunsaturated Fat',
    unit: 'g',
    bold: false,
    indent: true,
    showDV: false,
  },
  {
    key: 'monounsaturatedFatInG',
    label: 'Monounsaturated Fat',
    unit: 'g',
    bold: false,
    indent: true,
    showDV: false,
  },
  {
    key: 'cholesterolInMg',
    label: 'Cholesterol',
    unit: 'mg',
    bold: true,
    indent: false,
    showDV: true,
  },
  {
    key: 'sodiumInMg',
    label: 'Sodium',
    unit: 'mg',
    bold: true,
    indent: false,
    showDV: true,
  },
  {
    key: 'carbohydratesInG',
    label: 'Total Carbohydrate',
    unit: 'g',
    bold: true,
    indent: false,
    showDV: true,
  },
  {
    key: 'fiberInG',
    label: 'Dietary Fiber',
    unit: 'g',
    bold: false,
    indent: true,
    showDV: true,
  },
  {
    key: 'sugarInG',
    label: 'Total Sugars',
    unit: 'g',
    bold: false,
    indent: true,
    showDV: false,
  },
  {
    key: 'proteinInG',
    label: 'Protein',
    unit: 'g',
    bold: true,
    indent: false,
    showDV: false,
  },
]

const VITAMINS: VitaminConfig[] = [
  { key: 'vitaminDInIU', label: 'Vitamin D', unit: 'IU' },
  { key: 'calciumInMg', label: 'Calcium', unit: 'mg' },
  { key: 'ironInMg', label: 'Iron', unit: 'mg' },
  { key: 'potassiumInMg', label: 'Potassium', unit: 'mg' },
  { key: 'vitaminAInIU', label: 'Vitamin A', unit: 'IU' },
  { key: 'vitaminCInMg', label: 'Vitamin C', unit: 'mg' },
  { key: 'vitaminB6InMg', label: 'Vitamin B6', unit: 'mg' },
  { key: 'vitaminB12InMg', label: 'Vitamin B12', unit: 'mg' },
  { key: 'magnesiumInMg', label: 'Magnesium', unit: 'mg' },
  { key: 'folateInMcg', label: 'Folate', unit: 'mcg' },
  { key: 'thiaminInMg', label: 'Thiamin', unit: 'mg' },
  { key: 'riboflavinInMg', label: 'Riboflavin', unit: 'mg' },
  { key: 'niacinInMg', label: 'Niacin', unit: 'mg' },
]

export const NutritionalFacts = (props: INutritionalFactsProps) => {
  const nutritionalFacts = useRecipeStore((state) => state.nutritionalFacts)
  const { servings, servingAmount, servingUnit } = useRecipeStore((state) => ({
    servings: state.servings,
    servingAmount: state.servingAmount,
    servingUnit: state.servingUnit,
  }))
  const scaleFactor = useRecipeStore((state) => state.metadata.scaleFactor)
  const { customDailyNutrition, predefinedDailyNutrition } = useUserStore()
  const userNutritionalFacts =
    customDailyNutrition ?? predefinedDailyNutrition?.nutritionalFacts

  const getValue = (key: NutrientKey): number | null => {
    const val = nutritionalFacts?.[key]
    return typeof val === 'number' ? roundToDecimal(val * scaleFactor, 1) : null
  }

  const getDV = (key: NutrientKey): string | null => {
    const val = nutritionalFacts?.[key]
    const userVal = userNutritionalFacts?.[key]
    if (typeof val === 'number' && typeof userVal === 'number' && userVal > 0) {
      return calculatePercentage(val, userVal)
    }
    return null
  }

  const calories = getValue('caloriesInKcal')

  return (
    <div
      className={mergeCss('border-4 p-2 w-72', props.className)}
      style={{ fontFamily: '"Arial Narrow", Arial, sans-serif' }}
    >
      {/* Title */}
      <h1 className="text-3xl font-black leading-none tracking-tight">
        Nutrition Facts
      </h1>

      {/* approximate servings */}
      <div className="border-t pt-0.5 leading-none">
        <div className="">About {servings ?? '?'} servings per container</div>
        <div className="flex justify-between items-baseline">
          <span className="font-black">Serving size</span>
          <span className="font-black leading-none">
            {servingAmount ?? '?'} {servingUnit ?? '?'} (32g)
          </span>
        </div>
      </div>

      {/* Calories section */}
      <div className="border-t-8 mt-1 leading-none">
        <div className="text-xs font-semibold leading-none">
          Amount per serving
        </div>
        <div className="flex justify-between items-end -mt-2.5 -mb-1">
          <span className="text-xl font-bold leading-none">Calories</span>
          <span className="text-3xl font-black leading-none">
            {calories ?? '?'}
          </span>
        </div>
      </div>

      {/* % Daily Value header */}
      <div className="border-t-4 mt-1 pt-0.5 text-right text-xs font-bold">
        % Daily Value*
      </div>

      {/* Main nutrient rows */}
      {MAIN_ROWS.map((row) => {
        const val = getValue(row.key)
        const dv = getDV(row.key)
        return (
          <div
            key={row.key}
            className="flex justify-between items-baseline border-t text-sm"
          >
            <span className={row.indent ? 'pl-4' : ''}>
              {row.bold ? (
                <strong>{row.label}</strong>
              ) : (
                <span>{row.label}</span>
              )}{' '}
              <span>{val !== null ? `${val}${row.unit}` : `?${row.unit}`}</span>
            </span>
            <span className="font-bold shrink-0 ml-1">
              {row.showDV ? (dv ?? '?') : ''}
            </span>
          </div>
        )
      })}

      {/* Thick divider before vitamins */}
      <div className="border-t-8 mt-1" />

      {/* Vitamins & minerals */}
      {VITAMINS.map((vit, i) => {
        const val = getValue(vit.key)
        const dv = getDV(vit.key)
        return (
          <div
            key={vit.key}
            className={`flex justify-between items-baseline text-sm py-px ${i > 0 ? 'border-t' : ''}`}
          >
            <span>
              {vit.label} {val !== null ? `${val}${vit.unit}` : `?${vit.unit}`}
            </span>
            <span className="font-bold shrink-0 ml-1">{dv ?? '?'}</span>
          </div>
        )
      })}

      {/* Thick divider before footnote */}
      <div className="border-t-4 mt-1 mb-1" />

      {/* Footnote */}
      <p className="text-xs leading-tight">
        * The % Daily Value (DV) tells you how much a nutrient in a serving
        contributes to your configured daily diet.{' '}
        {userNutritionalFacts?.caloriesInKcal ?? '2000'} calories a day is
        configured.
      </p>
    </div>
  )
}
