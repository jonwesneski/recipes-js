-- CreateEnum
CREATE TYPE "MeasurementUnit" AS ENUM ('whole', 'cups', 'fluidOunces', 'tablespoons', 'teaspoons', 'pints', 'quarts', 'gallons', 'pounds', 'ounces', 'liters', 'milliliters', 'kilograms', 'grams');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeUserHandle" TEXT NOT NULL,
    "recipeSlug" TEXT NOT NULL,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follows" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "preparationTimeInMinutes" INTEGER,
    "cookingTimeInMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userHandle" TEXT NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("userHandle","slug")
);

-- CreateTable
CREATE TABLE "nutritional_facts" (
    "id" TEXT NOT NULL,
    "servings" INTEGER,
    "servingAmount" INTEGER,
    "servingUnit" "MeasurementUnit",
    "caloriesInKcal" INTEGER,
    "totalFatInG" INTEGER,
    "saturatedFatInG" INTEGER,
    "transFatInG" INTEGER,
    "cholesterolInMg" INTEGER,
    "sodiumInMg" INTEGER,
    "carbohydratesInG" INTEGER,
    "fiberInG" INTEGER,
    "sugarInG" INTEGER,
    "proteinInG" INTEGER,
    "vitaminAInIU" INTEGER,
    "vitaminCInMg" INTEGER,
    "vitaminDInIU" INTEGER,
    "vitaminB6InMg" INTEGER,
    "vitaminB12InMg" INTEGER,
    "calciumInMg" INTEGER,
    "ironInMg" INTEGER,
    "magnesiumInMg" INTEGER,
    "potassiumInMg" INTEGER,
    "folateInMcg" INTEGER,
    "thiaminInMg" INTEGER,
    "riboflavinInMg" INTEGER,
    "niacinInMg" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recipeUserHandle" TEXT NOT NULL,
    "recipeSlug" TEXT NOT NULL,

    CONSTRAINT "nutritional_facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" TEXT NOT NULL,
    "instruction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recipeUserHandle" TEXT NOT NULL,
    "recipeSlug" TEXT NOT NULL,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recipeUserHandle" TEXT NOT NULL,
    "recipeSlug" TEXT NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "unit" "MeasurementUnit" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stepId" TEXT NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recipeUserHandle" TEXT,
    "recipeSlug" TEXT
);

-- CreateTable
CREATE TABLE "recipe_tags" (
    "recipeUserHandle" TEXT NOT NULL,
    "recipeSlug" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "recipe_tags_pkey" PRIMARY KEY ("recipeUserHandle","recipeSlug","tagName")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_handle_key" ON "users"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_id_key" ON "recipes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_slug_key" ON "recipes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "nutritional_facts_recipeUserHandle_recipeSlug_key" ON "nutritional_facts"("recipeUserHandle", "recipeSlug");

-- CreateIndex
CREATE UNIQUE INDEX "equipments_name_key" ON "equipments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_id_key" ON "tags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_recipeUserHandle_recipeSlug_fkey" FOREIGN KEY ("recipeUserHandle", "recipeSlug") REFERENCES "recipes"("userHandle", "slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_userHandle_fkey" FOREIGN KEY ("userHandle") REFERENCES "users"("handle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritional_facts" ADD CONSTRAINT "nutritional_facts_recipeUserHandle_recipeSlug_fkey" FOREIGN KEY ("recipeUserHandle", "recipeSlug") REFERENCES "recipes"("userHandle", "slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_recipeUserHandle_recipeSlug_fkey" FOREIGN KEY ("recipeUserHandle", "recipeSlug") REFERENCES "recipes"("userHandle", "slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_recipeUserHandle_recipeSlug_fkey" FOREIGN KEY ("recipeUserHandle", "recipeSlug") REFERENCES "recipes"("userHandle", "slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_recipeUserHandle_recipeSlug_fkey" FOREIGN KEY ("recipeUserHandle", "recipeSlug") REFERENCES "recipes"("userHandle", "slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_recipeUserHandle_recipeSlug_fkey" FOREIGN KEY ("recipeUserHandle", "recipeSlug") REFERENCES "recipes"("userHandle", "slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "tags"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
