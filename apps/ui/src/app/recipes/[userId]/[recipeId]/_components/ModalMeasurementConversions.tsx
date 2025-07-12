import { ModalCentered } from '@repo/design-system'
import {
  getConversions,
  type VolumeUnit,
  type WeightUnit,
} from '@src/utils/measurements'
import { useEffect, useRef } from 'react'

const ConversionRows = (props: {
  unitSystem: string
  conversions: [string, number][]
}) => {
  return (
    <>
      <tr>
        <th className="text-center text-xs bg-green-800" colSpan={2}>
          {props.unitSystem}
        </th>
      </tr>
      {props.conversions.map(([unit, amount]) => (
        <tr key={unit}>
          <td className="border-t border-gray-100 text-right pr-2">{unit}</td>
          <td className="border-t border-gray-100">{amount}</td>
        </tr>
      ))}
    </>
  )
}

interface ModalMeasurementConversionsProps {
  unitType: VolumeUnit | WeightUnit
  amount: number
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
      <h2>{conversions.type} Conversions</h2>
      <table className="w-full table-auto rounded-3xl border-collapse bg-amber-100">
        <thead>
          <tr>
            <th className="text-right pr-2">Unit</th>
            <th className="text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          <ConversionRows
            unitSystem="Imperial"
            conversions={Object.entries(conversions.values.imperial)}
          />
          <ConversionRows
            unitSystem="Metric"
            conversions={Object.entries(conversions.values.metric)}
          />
        </tbody>
      </table>
    </ModalCentered>
  )
}
