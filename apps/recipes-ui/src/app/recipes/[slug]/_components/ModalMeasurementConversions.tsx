import { useEffect, useRef } from "react";
import { getVolumeConversions } from "../../../../utils";
import { ModalCentered } from "../../../ModalCentered";


const ConversionRows = (props: {unitSystem: string, conversions: [string, number][]}) => {
  return (
    <>
      <tr><th className="text-center text-xs bg-green-800" colSpan={2}>{props.unitSystem}</th></tr>
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
  unitType: string;
  amount: number;
}
export function ModalMeasurementConversions(props: ModalMeasurementConversionsProps) {
  const divRef = useRef<HTMLElement>(null);
  const conversions = getVolumeConversions(props.amount, props.unitType as any);

  useEffect(() => {
    divRef?.current?.focus();
  }, [])
  
  return (
      <ModalCentered>
          <h2>Measurement Conversions</h2>
          <table className='w-full table-auto rounded-3xl border-collapse bg-amber-100'>
              <thead>
                  <tr>
                      <th className="text-right pr-2">Unit</th>
                      <th className="text-left">Amount</th>
                  </tr>
              </thead>
              <tbody>
                <ConversionRows unitSystem="Imperial" conversions={Object.entries(conversions.imperial)} />
                <ConversionRows unitSystem="Metric" conversions={Object.entries(conversions.metric)} />
              </tbody>
          </table>
      </ModalCentered>
  )
}