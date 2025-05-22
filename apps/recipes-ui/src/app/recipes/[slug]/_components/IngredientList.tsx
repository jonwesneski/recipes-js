'use client'
import type {IngredientEntity} from '../../../../../node_modules/@repo/recipes-codegen/dist/types/model/ingredientEntity';
import { useUserStore } from '../../../../providers/use-store-provider';
import { numberToFraction } from '../../../../utils';

// function Modal() {
//     const modalRoot = document.getElementById('modal-root')!;
//     const [isOpen, setIsOpen] = useState(false);

//     const openModal = () => {
//         setIsOpen(true);
//     };

//     const closeModal = () => {
//         setIsOpen(false);
//     };

//     return ReactDOM.createPortal(
//         <div>
//             <button onClick={openModal}>Open Modal</button>
//             {isOpen && (
//                 <div className="modal">
//                     <h2>Modal Title</h2>
//                     <p>Modal Content</p>
//                     <button onClick={closeModal}>Close Modal</button>
//                 </div>
//             )}
//         </div>,
//         modalRoot
//     );
// }

export default function IngredientList({ingredients}: {ingredients: IngredientEntity[]}) {
   const useFractions = useUserStore(state => state.useFractions);
   console.log('useFractions', useFractions);
   console.log('aaadfasdfasf')
    return (
        <ul className="ingredient-list">{ingredients.map(
            (ingredient, index) => {
                return (
                    <li key={index} style={{textAlign: 'left'}}>
                        <span>{useFractions ? numberToFraction(ingredient.amount) : ingredient.amount}</span> <a href="" style={{textDecorationStyle: 'dotted', color: 'black', display: 'inline-block', textUnderlineOffset: '4px'}}>{ingredient.unit}</a> {ingredient.name}
                    </li>
                )
            }
        )}</ul>
    )
}
