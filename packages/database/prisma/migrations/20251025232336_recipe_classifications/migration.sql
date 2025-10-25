-- CreateEnum
CREATE TYPE "CuisineType" AS ENUM ('thai', 'indian', 'chinese', 'japanese', 'korean', 'vietnamese', 'filipino', 'indonesian', 'malaysian', 'singaporean', 'taiwanese', 'burmese', 'mongolian', 'spanish', 'french', 'italian', 'british', 'german', 'irish', 'polish', 'russian', 'portuguese', 'turkish', 'scandinavian', 'dutch', 'belgian', 'austrian', 'swiss', 'hungarian', 'czech', 'middleEastern', 'greek', 'lebanese', 'moroccan', 'egyptian', 'tunisian', 'israeli', 'mexican', 'american', 'caribbean', 'brazilian', 'peruvian', 'argentinian', 'colombian', 'cuban', 'jamaican', 'ethiopian', 'nigerian', 'southAfrican', 'kenyan', 'ghanaian', 'fusion', 'contemporary', 'cajunCreole', 'texMex', 'mediterranean', 'latinAmerican', 'southeastAsian', 'eastAsian', 'northAfrican', 'westAfrican', 'centralAmerican', 'southAmerican', 'pacificIslander');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack', 'dessert');

-- CreateEnum
CREATE TYPE "DishType" AS ENUM ('soup', 'stew', 'chili', 'broth', 'bisque', 'salad', 'slaw', 'casserole', 'stirFry', 'roast', 'grill', 'pasta', 'pizza', 'sandwich', 'burger', 'tacos', 'curry', 'rice', 'noodles', 'side', 'appetizer', 'dimSum', 'mezes', 'bread', 'pastry', 'pie', 'cake', 'cookies', 'beverage', 'smoothie', 'cocktail', 'sauce', 'condiment', 'dip', 'chutney', 'salsa');

-- CreateEnum
CREATE TYPE "DietaryType" AS ENUM ('vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'nutFree', 'lowCarb');

-- CreateEnum
CREATE TYPE "ProteinType" AS ENUM ('chicken', 'turkey', 'duck', 'quail', 'beef', 'pork', 'lamb', 'veal', 'venison', 'bison', 'goat', 'salmon', 'tuna', 'cod', 'halibut', 'tilapia', 'trout', 'mahi', 'swordfish', 'seaBass', 'snapper', 'shrimp', 'crab', 'lobster', 'scallops', 'clams', 'mussels', 'oysters', 'squid', 'octopus', 'tofu', 'tempeh', 'seitan', 'legumes', 'nuts', 'seeds', 'eggs', 'cheese', 'yogurt', 'bacon', 'sausage', 'deli', 'plantBasedMeat');

-- CreateEnum
CREATE TYPE "DifficultyLevelType" AS ENUM ('easy', 'medium', 'hard');

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "cuisine" "CuisineType",
ADD COLUMN     "diets" "DietaryType"[],
ADD COLUMN     "difficultyLevel" "DifficultyLevelType",
ADD COLUMN     "dish" "DishType",
ADD COLUMN     "meal" "MealType",
ADD COLUMN     "proteins" "ProteinType"[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "preferedDiets" "DietaryType"[];

-- CreateTable
CREATE TABLE "FoodTag" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT,
    "userId" TEXT,
    "cuisineType" "CuisineType",
    "mealType" "MealType",
    "dishType" "DishType",
    "dietaryFlags" "DietaryType"[],
    "proteinTypes" "ProteinType"[],

    CONSTRAINT "FoodTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodTag_recipeId_key" ON "FoodTag"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodTag_userId_key" ON "FoodTag"("userId");
