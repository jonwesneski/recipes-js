'use client'
import type { NutritionalFactsEntity } from '../../../../../node_modules/@repo/recipes-codegen/dist/types/model/nutritionalFactsEntity';

interface NutritionalFactsProps {
    nutritionalFacts: NutritionalFactsEntity;
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
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.caloriesInKcal ? `${nutritionalFacts.caloriesInKcal} kcal`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Fat</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.totalFatInG ? `${nutritionalFacts.totalFatInG} g`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Saturated Fat</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.saturatedFatInG ? `${nutritionalFacts.saturatedFatInG} g`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Trans Fat</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.transFatInG ? `${nutritionalFacts.transFatInG} g`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Protein</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.proteinInG ? `${nutritionalFacts.proteinInG} g`: '?'}</td>
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
            <tr>
              <td style={{ textAlign: 'left' }}>Sodium</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.sodiumInMg ? `${nutritionalFacts.sodiumInMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Cholesterol</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.cholesterolInMg ? `${nutritionalFacts.cholesterolInMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Potassium</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.potassiumInMg ? `${nutritionalFacts.potassiumInMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Vitamin A</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.vitaminAInIU ? `${nutritionalFacts.vitaminAInIU} IU`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Vitamin C</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.vitaminCInMg ? `${nutritionalFacts.vitaminCInMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Calcium</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.calciumInMg ? `${nutritionalFacts.calciumInMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Iron</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.ironInMg ? `${nutritionalFacts.ironInMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Vitamin D</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.vitaminDInIU ? `${nutritionalFacts.vitaminDInIU} IU`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Vitamin B6</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.vitaminB6InMg ? `${nutritionalFacts.vitaminB6InMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Vitamin B12</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.vitaminB12InMg ? `${nutritionalFacts.vitaminB12InMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Magnesium</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.magnesiumInMg ? `${nutritionalFacts.magnesiumInMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Folate</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.folateInMcg ? `${nutritionalFacts.folateInMcg} mcg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Thiamin</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.thiaminInMg ? `${nutritionalFacts.thiaminInMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Riboflavin</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.riboflavinInMg ? `${nutritionalFacts.riboflavinInMg} mg`: '?'}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Niacin</td>
              <td style={{ textAlign: 'left' }}>{nutritionalFacts.niacinInMg ? `${nutritionalFacts.niacinInMg} mg`: '?'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
}
