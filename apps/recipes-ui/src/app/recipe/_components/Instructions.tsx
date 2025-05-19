import IngredientList, { IngredientType } from "./IngredientList";





export type StepType = {
    ingredients: IngredientType[];
    instruction: string;
}

export type InstructionsType = {
    steps: StepType[];
}

export function Instructions({instruction}: {instruction: InstructionsType}) {
    return (
        <table className="instructions">
            <thead>
                <tr key="header">
                    <th>Ingredients</th>
                    <th>Instructions</th>
                </tr>
            </thead>
            <tbody>
                {instruction.steps.map((step, index) => {
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