'use client'
import type {StepEntity} from '../../../../../node_modules/@repo/recipes-codegen/dist/types/model/stepEntity';
import type {IngredientEntity} from '../../../../../node_modules/@repo/recipes-codegen/dist/types/model/ingredientEntity';

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

interface IngredientListProps {
    ingredients: IngredientEntity[];
}
export default function IngredientList(props: IngredientListProps) {
    return (
        <ul className="ingredient-list">{props.ingredients.map(
            (ingredient, index) => {
                return (
                    <li key={index} style={{textAlign: 'left'}}>
                        <span>{ingredient.amount}</span> <a href="" style={{textDecorationStyle: 'dotted', color: 'black', display: 'inline-block', textUnderlineOffset: '4px'}}>{ingredient.unit}</a> {ingredient.name}
                    </li>
                )
            }
        )}</ul>
    )
}








interface RecipeStepsProps {
    steps: StepEntity[];
}
export function RecipeSteps(props: RecipeStepsProps) {
    return (
        <table className="instructions">
            <thead>
                <tr key="header">
                    <th>Ingredients</th>
                    <th>Instructions</th>
                </tr>
            </thead>
            <tbody>
                {props.steps.map((step, index) => {
                    return (
                        <tr key={index}>
                            <td>
                                <p style={{textAlign: 'left'}}>{`step ${index + 1}.`}</p>
                                <IngredientList ingredients={step.ingredients} />
                            </td>
                            <td>{step.instruction}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
                
    )
}