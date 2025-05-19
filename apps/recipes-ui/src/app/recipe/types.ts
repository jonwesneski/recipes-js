
export type IngredientType = {
    name: string;
    amount: number;
    measurement: string;
}

export type StepType = {
    ingredients: IngredientType[];
    instructions: string;
}

export type DurationType = {
    hours: number;
    minutes: number;
}

export type NutritionalFactsType = {
    calories?: number;
    proteinInG?: number;
    fatInG?: number;
    carbohydratesInG?: number;
    fiberInG?: number;
    sugarInG?: number;
}

export type RecipeType = {
    name: string;
    description?: string;
    preparationTime?: DurationType;
    cookingTime?: DurationType;
    steps: StepType[];
    nutritionalFacts: NutritionalFactsType
    tags: string[];
}