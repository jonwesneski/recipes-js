'use client'

import type {IngredientEntity} from '../../../../../node_modules/@repo/recipes-codegen/dist/types/model/ingredientEntity';
import { useUserStore } from '../../../../providers/use-store-provider';
import { numberToFraction } from '../../../../utils';
import { useCustomModal } from '../../../hooks/useCustomModal';
import ModalMeasurementConversions from './ModalMeasurementConversions';

export default function IngredientList({ingredients}: {ingredients: IngredientEntity[]}) {
   const useFractions = useUserStore(state => state.useFractions);
   const {showModal} = useCustomModal();

   const handleClick = (e: React.MouseEvent, ingredient: IngredientEntity) => {
        e.preventDefault();
        showModal(ModalMeasurementConversions.name, () => <ModalMeasurementConversions unitType={ingredient.unit} amount={ingredient.amount} />, {});
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
