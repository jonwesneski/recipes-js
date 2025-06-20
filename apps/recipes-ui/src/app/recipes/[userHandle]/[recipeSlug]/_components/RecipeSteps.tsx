'use client'

import type { StepEntity } from '@repo/recipes-codegen/models'
import React from 'react'
import { IngredientList } from './IngredientList'

interface RecipeStepsProps {
  steps: StepEntity[]
}
export const RecipeSteps = (props: RecipeStepsProps) => {
  return (
    <table
      id="instructions"
      className="border border-separate rounded-2xl border-gray-800"
    >
      <thead>
        <tr>
          <th>Ingredients</th>
          <th>Instructions</th>
        </tr>
      </thead>
      <tbody>
        {props.steps.map((step, index) => {
          return (
            <React.Fragment key={index}>
              <tr>
                <td
                  colSpan={2}
                  className="border-t-2 border-gray-800"
                >{`step ${index + 1}.`}</td>
              </tr>
              <tr key={index}>
                <td width="35%" className="align-top">
                  <IngredientList ingredients={step.ingredients} />
                </td>
                <td className="text-left align-top">{step.instruction}</td>
              </tr>
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
