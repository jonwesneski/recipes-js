/*
  Warnings:

  - You are about to drop the column `useFractions` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."NumberFormat" AS ENUM ('default', 'decimal', 'fraction');

-- AlterTable
ALTER TABLE "public"."ingredients" ADD COLUMN     "isFraction" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "useFractions",
ADD COLUMN     "numberFormat" "public"."NumberFormat" NOT NULL DEFAULT 'default';
