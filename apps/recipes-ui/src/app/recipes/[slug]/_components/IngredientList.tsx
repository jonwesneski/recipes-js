'use client'
import { useEffect, useRef } from 'react';
import type {IngredientEntity} from '../../../../../node_modules/@repo/recipes-codegen/dist/types/model/ingredientEntity';
import { useUserStore } from '../../../../providers/use-store-provider';
import { getVolumeConversions, numberToFraction } from '../../../../utils';
import { useCustomModal } from '../../../hooks/useCustomModal';
import { ModalCentered } from '../../../ModalCentered';

interface MeasurementModalProps {
  unitType: string;
  amount: number;
}
const MeasurementModal = (props: MeasurementModalProps) => {
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

export default function IngredientList({ingredients}: {ingredients: IngredientEntity[]}) {
   const useFractions = useUserStore(state => state.useFractions);
   const {showModal} = useCustomModal();

   const handleClick = (e: React.MouseEvent, ingredient: IngredientEntity) => {
        e.preventDefault();
        showModal('ingredient-modal', () => <MeasurementModal unitType={ingredient.unit} amount={ingredient.amount} />, {});
    }

    return (
        <ul className="ingredient-list">{
            ingredients.map((ingredient, index) => {
                return (
                    <li key={index} style={{textAlign: 'left'}}>
                        <span>{useFractions ? numberToFraction(ingredient.amount) : ingredient.amount}</span> <a href="javascript:void(0)" onClick={(e) => handleClick(e, ingredient)} style={{textDecorationStyle: 'dotted', color: 'black', display: 'inline-block', textUnderlineOffset: '4px'}}>{ingredient.unit}</a> {ingredient.name}
                    </li>
                )
            }
        )}</ul>
    )
}
