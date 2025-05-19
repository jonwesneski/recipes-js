import { useState } from "react";
import ReactDOM from "react-dom";

export type IngredientType = {
    name: string;
    amount: number;
    measurement: string;
}

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

export default function IngredientList({ingredients}: {ingredients: IngredientType[]}) {
    return (
        <ul className="ingredient-list">{ingredients.map(
            (ingredient, index) => {
                return (
                    <li key={index} style={{textAlign: 'left'}}>
                        <span>{ingredient.amount}</span> <a href="" style={{textDecorationStyle: 'dotted', color: 'black', display: 'inline-block', textUnderlineOffset: '4px'}}>{ingredient.measurement}</a> {ingredient.name}
                    </li>
                )
            }
        )}</ul>
    )
}
