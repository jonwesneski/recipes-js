
const MILLILITRES_PER_CUP = 236.588;
const GRAMS_PER_OUNCE = 28.3495;


export function cupsToMillilitres(cups: number): number {
    return cups * MILLILITRES_PER_CUP;
}

export function millilitresToCups(millilitres: number): number {
    return millilitres / MILLILITRES_PER_CUP;
}

// export function cupsToGrams(cups: number, gramsPerCup: number): number {
//     return cups * gramsPerCup;
// }

// export function gramsToCups(grams: number, gramsPerCup: number): number {
//     return grams / gramsPerCup;
// }


export function ouncesToGrams(ounces: number): number {
    return ounces * GRAMS_PER_OUNCE;
}

export function gramsToOunces(grams: number): number {
    return grams / GRAMS_PER_OUNCE;
}
