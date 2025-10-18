/*
  Warnings:

  - A unique constraint covering the columns `[userId,followingId]` on the table `user_follows` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_follows_userId_followingId_key" ON "public"."user_follows"("userId", "followingId");
