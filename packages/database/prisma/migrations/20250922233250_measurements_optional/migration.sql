/*
  Warnings:

  - The values [whole,pinches] on the enum `MeasurementUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."ingredients" ALTER COLUMN "unit" DROP NOT NULL;

UPDATE "public"."nutritional_facts" SET "servingUnit" = NULL WHERE "servingUnit" = 'whole';
UPDATE "public"."nutritional_facts" SET "servingUnit" = NULL WHERE "servingUnit" = 'pinches';

UPDATE "public"."ingredients" SET "unit" = NULL WHERE "unit" = 'whole';
UPDATE "public"."ingredients" SET "unit" = NULL WHERE "unit" = 'pinches';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."MeasurementUnit_new" AS ENUM ('cups', 'fluidOunces', 'tablespoons', 'teaspoons', 'pints', 'quarts', 'gallons', 'pounds', 'ounces', 'liters', 'milliliters', 'kilograms', 'grams');
ALTER TABLE "public"."nutritional_facts" ALTER COLUMN "servingUnit" TYPE "public"."MeasurementUnit_new" USING ("servingUnit"::text::"public"."MeasurementUnit_new");
ALTER TABLE "public"."ingredients" ALTER COLUMN "unit" TYPE "public"."MeasurementUnit_new" USING ("unit"::text::"public"."MeasurementUnit_new");
ALTER TYPE "public"."MeasurementUnit" RENAME TO "MeasurementUnit_old";
ALTER TYPE "public"."MeasurementUnit_new" RENAME TO "MeasurementUnit";
DROP TYPE "public"."MeasurementUnit_old";
COMMIT;


