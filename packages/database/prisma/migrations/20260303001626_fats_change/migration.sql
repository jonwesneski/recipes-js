/*
  Warnings:

  - You are about to drop the column `totalFatInG` on the `nutritional_facts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nutritional_facts" DROP COLUMN "totalFatInG",
ADD COLUMN     "monounsaturatedFatInG" INTEGER,
ADD COLUMN     "polyunsaturatedFatInG" INTEGER;
