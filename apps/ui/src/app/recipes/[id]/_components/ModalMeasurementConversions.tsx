'use client'

import { ModalCentered } from '@repo/design-system'
import { roundToDecimal } from '@src/utils/calculate'
import {
  type ConversionOption,
  type MeasurementUnitType,
  type VolumeUnit,
  type WeightUnit,
  getConversions,
} from '@src/utils/measurements'
import { useEffect, useRef } from 'react'

const ConversionRows = (props: {
  unitSystem: string
  conversions: (ConversionOption<VolumeUnit> | ConversionOption<WeightUnit>)[]
}) => {
  return (
    <>
      <tr>
        <th className="border-y text-center text-xs" colSpan={2}>
          {props.unitSystem}
        </th>
      </tr>
      {props.conversions.map((c) => (
        <tr key={c.id}>
          <td className="text-right pr-2 border-r">{c.label}</td>
          <td className="pl-2">{roundToDecimal(c.value, 2)}</td>
        </tr>
      ))}
    </>
  )
}

interface ModalMeasurementConversionsProps {
  unitType: MeasurementUnitType
  amount: number
  name: string
}
export const ModalMeasurementConversions = (
  props: ModalMeasurementConversionsProps,
) => {
  const divRef = useRef<HTMLElement>(null)
  const conversions = getConversions(props.amount, props.unitType)

  useEffect(() => {
    divRef.current?.focus()
  }, [])

  return (
    <ModalCentered>
      <h2 className="text-center">{conversions.type} Conversions for:</h2>
      <h2 className="text-center">
        {props.amount} {props.unitType} {props.name}
      </h2>
      <table className="w-full table-auto mt-4 border-collapse">
        <thead>
          <tr>
            <th className="text-right pr-2 border-r">Unit</th>
            <th className="text-left pl-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <ConversionRows
            unitSystem="Imperial"
            conversions={conversions.imperial}
          />
          <ConversionRows
            unitSystem="Metric"
            conversions={conversions.metric}
          />
        </tbody>
      </table>
    </ModalCentered>
  )
}
