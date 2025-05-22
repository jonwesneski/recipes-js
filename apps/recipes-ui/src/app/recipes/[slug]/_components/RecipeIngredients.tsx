'use client'
import React from "react";
import type {StepEntity} from '../../../../../node_modules/@repo/recipes-codegen/dist/types/model/stepEntity';

interface RecipeIngredientsProps {
    steps: StepEntity[];
}
export function RecipeIngredients(props: RecipeIngredientsProps) {
    return (
        <ul className="recipe-ingredients">
            {props.steps.map((step, stepIdx) => (
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