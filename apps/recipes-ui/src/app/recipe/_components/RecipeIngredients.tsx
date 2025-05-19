import React from "react";
import { StepType } from "./Instructions.tsx";

export function RecipeIngredients({steps}: {steps: StepType[]}) {
    return (
        <ul className="recipe-ingredients">
            {steps.map((step, stepIdx) => (
                <React.Fragment key={stepIdx}>
                    {step.ingredients.map((ingredient, idx: number) => (
                        <li key={idx} style={{listStyleType: 'none'}}>
                            {`${ingredient.amount} ${ingredient.measurement} ${ingredient.name}`}
                        </li>
                    ))}
                </React.Fragment>
            ))}
        </ul>
    )
}