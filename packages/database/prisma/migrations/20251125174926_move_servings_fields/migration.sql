/*
  Warnings:

  - You are about to drop the column `servingAmount` on the `nutritional_facts` table. All the data in the column will be lost.
  - You are about to drop the column `servingUnit` on the `nutritional_facts` table. All the data in the column will be lost.
  - You are about to drop the column `servings` on the `nutritional_facts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nutritional_facts" DROP COLUMN "servingAmount",
DROP COLUMN "servingUnit",
DROP COLUMN "servings";

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "servingAmount" INTEGER,
ADD COLUMN     "servingUnit" "MeasurementUnit",
ADD COLUMN     "servings" INTEGER;
