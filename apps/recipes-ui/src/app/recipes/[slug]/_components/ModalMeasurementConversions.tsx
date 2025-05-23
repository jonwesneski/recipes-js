import { useEffect, useRef } from "react";
import { getVolumeConversions } from "../../../../utils";
import { ModalCentered } from "../../../ModalCentered";

interface ModalMeasurementConversionsProps {
  unitType: string;
  amount: number;
}
export default function ModalMeasurementConversions(props: ModalMeasurementConversionsProps) {
  const divRef = useRef<HTMLElement>(null);
  const conversions = getVolumeConversions(props.amount, props.unitType as any);

  useEffect(() => {
    divRef?.current?.focus();
  }, [])
  
  return (
      <ModalCentered>
          <h2>Other Measurements</h2>
          <table>
              <thead>
                  <tr>
                      <th>Unit</th>
                      <th>Amount</th>
                  </tr>
              </thead>
              <tbody>
                  <tr><th>Imperial</th></tr>
                  {Object.entries(conversions.imperial).map(([unit, amount]) => (
                      <tr key={unit}>
                          <td>{unit}</td>
                          <td>{amount}</td>
                      </tr>
                  ))}
                  <tr><th>Metric</th></tr>
                  {Object.entries(conversions.metric).map(([unit, amount]) => (
                      <tr key={unit}>
                          <td>{unit}</td>
                          <td>{amount}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </ModalCentered>
  )
}