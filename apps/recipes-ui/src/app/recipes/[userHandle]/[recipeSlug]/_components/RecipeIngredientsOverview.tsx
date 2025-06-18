'use client'
import { StepEntity } from "@repo/recipes-codegen/models";
import { useUserStore } from "../../../../../providers/use-store-provider";
import { numberToFraction } from "../../../../../utils";

interface RecipeIngredientsOverviewProps {
    steps: StepEntity[];
}

type UniqueIngredientsType = {
    [name in string]: {
        amount: number;
        unit: string;
    };
}
const createUniqueIngredient = (steps: StepEntity[]): UniqueIngredientsType => {
    const uniqueIngredients: UniqueIngredientsType = {};
    steps.forEach((step) => {
        step.ingredients.forEach((ingredient) => {
            if (!uniqueIngredients[ingredient.name]) {
                uniqueIngredients[ingredient.name] = {
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                };
            } else {
                uniqueIngredients[ingredient.name].amount += ingredient.amount;
            }
        });
    }
    );
    return uniqueIngredients;
}

export function RecipeIngredientsOverview(props: RecipeIngredientsOverviewProps) {
    const uniqueIngredients = createUniqueIngredient(props.steps);
    const useFractions = useUserStore(state => state.useFractions); 

    return (
        <ul className="recipe-ingredients-overview">
            {Object.keys(uniqueIngredients).map((name, idx) => (
                <li key={idx} style={{listStyleType: 'none'}}>
                    {`${useFractions ? numberToFraction(uniqueIngredients[name].amount): uniqueIngredients[name].amount} ${uniqueIngredients[name].unit} ${name}`}
                </li>
            ))}
        </ul>
    )
}
