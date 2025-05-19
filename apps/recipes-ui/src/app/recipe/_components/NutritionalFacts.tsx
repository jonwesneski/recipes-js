import { NutritionalFactsType } from "../types.ts";

interface NutritionalFactsProps {
    nutritionalFacts: NutritionalFactsType;
}
export function NutritionalFacts(props: NutritionalFactsProps) {
    const { nutritionalFacts } = props;

    return (
        <div className="nutritional-facts" style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h3>Nutritional Facts</h3>
            <table className="nutritional-facts-table" style={{borderCollapse: 'collapse', margin: 'auto'}}>
            <tbody>
                <tr>
                    <td style={{ textAlign: 'left' }}>Calories</td>
                    <td style={{ textAlign: 'left' }}>{nutritionalFacts.calories ? `${nutritionalFacts.calories} kcal`: '?'}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left' }}>Protein</td>
                    <td style={{ textAlign: 'left' }}>{nutritionalFacts.proteinInG ? `${nutritionalFacts.proteinInG} g`: '?'}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left' }}>Fat</td>
                    <td style={{ textAlign: 'left' }}>{nutritionalFacts.fatInG ? `${nutritionalFacts.fatInG} g`: '?'}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left' }}>Carbohydrates</td>
                    <td style={{ textAlign: 'left' }}>{nutritionalFacts.carbohydratesInG ? `${nutritionalFacts.carbohydratesInG} g`: '?'}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left' }}>Fiber</td>
                    <td style={{ textAlign: 'left' }}>{nutritionalFacts.fiberInG ? `${nutritionalFacts.fiberInG} g`: '?'}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left' }}>Sugar</td>
                    <td style={{ textAlign: 'left' }}>{nutritionalFacts.sugarInG ? `${nutritionalFacts.sugarInG} g`: '?'}</td>
                </tr>
            </tbody>
            </table>
        </div>
    );
}