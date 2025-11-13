/*
  Warnings:

  - You are about to drop the column `userId` on the `nutritional_facts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customDailyNutritionId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."nutritional_facts" DROP CONSTRAINT "nutritional_facts_userId_fkey";

-- DropIndex
DROP INDEX "public"."nutritional_facts_userId_key";

-- AlterTable
ALTER TABLE "nutritional_facts" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "customDailyNutritionId" TEXT,
ADD COLUMN     "predefinedDailyNutritionId" TEXT;

-- CreateTable
CREATE TABLE "diets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nutritionalFactsId" TEXT,

    CONSTRAINT "diets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "diets_name_key" ON "diets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "diets_nutritionalFactsId_key" ON "diets"("nutritionalFactsId");

-- CreateIndex
CREATE INDEX "diets_name_idx" ON "diets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_customDailyNutritionId_key" ON "users"("customDailyNutritionId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_predefinedDailyNutritionId_fkey" FOREIGN KEY ("predefinedDailyNutritionId") REFERENCES "diets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_customDailyNutritionId_fkey" FOREIGN KEY ("customDailyNutritionId") REFERENCES "nutritional_facts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diets" ADD CONSTRAINT "diets_nutritionalFactsId_fkey" FOREIGN KEY ("nutritionalFactsId") REFERENCES "nutritional_facts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
