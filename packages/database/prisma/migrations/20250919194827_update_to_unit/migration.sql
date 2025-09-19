/*
  Warnings:

  - You are about to drop the column `useImperial` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MeasurementFormat" AS ENUM ('default', 'imperial', 'metric');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "useImperial",
ADD COLUMN     "measurementFormat" "public"."MeasurementFormat" NOT NULL DEFAULT 'default';
