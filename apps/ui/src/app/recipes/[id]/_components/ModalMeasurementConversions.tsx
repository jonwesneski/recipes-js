import { ModalCentered } from '@repo/design-system'
import {
  getConversions,
  roundToDecimal,
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
        <th className="border-y text-center text-xs" colSpan={2}>
          {props.unitSystem}
        </th>
      </tr>
      {props.conversions.map(([unit, amount]) => (
        <tr key={unit}>
          <td className="text-right pr-2 border-r">{unit}</td>
          <td className="pl-2">{roundToDecimal(amount, 2)}</td>
        </tr>
      ))}
    </>
  )
}

interface ModalMeasurementConversionsProps {
  unitType: VolumeUnit | WeightUnit
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
