/*
  Warnings:

  - You are about to drop the column `useDarkMode` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UiTheme" AS ENUM ('system', 'light', 'dark');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "useDarkMode",
ADD COLUMN     "uiTheme" "UiTheme" NOT NULL DEFAULT 'system';
