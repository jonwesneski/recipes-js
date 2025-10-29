-- CreateIndex
CREATE INDEX "equipments_recipeId_idx" ON "equipments"("recipeId");

-- CreateIndex
CREATE INDEX "ingredients_name_idx" ON "ingredients"("name");

-- CreateIndex
CREATE INDEX "recipe_bookmarks_recipeId_idx" ON "recipe_bookmarks"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_bookmarks_userId_createdAt_idx" ON "recipe_bookmarks"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "recipe_tags_tagId_idx" ON "recipe_tags"("tagId");

-- CreateIndex
CREATE INDEX "recipes_isPublic_idx" ON "recipes"("isPublic");

-- CreateIndex
CREATE INDEX "recipes_isPublic_createdAt_idx" ON "recipes"("isPublic", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "recipes_userId_createdAt_idx" ON "recipes"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "recipes_userId_isPublic_idx" ON "recipes"("userId", "isPublic");

-- CreateIndex
CREATE INDEX "recipes_name_idx" ON "recipes"("name");

-- CreateIndex
CREATE INDEX "recipes_isPublic_cuisine_idx" ON "recipes"("isPublic", "cuisine");

-- CreateIndex
CREATE INDEX "recipes_isPublic_meal_idx" ON "recipes"("isPublic", "meal");

-- CreateIndex
CREATE INDEX "recipes_isPublic_dish_idx" ON "recipes"("isPublic", "dish");

-- CreateIndex
CREATE INDEX "recipes_isPublic_difficultyLevel_idx" ON "recipes"("isPublic", "difficultyLevel");

-- CreateIndex
CREATE INDEX "recipes_diets_idx" ON "recipes" USING GIN ("diets");

-- CreateIndex
CREATE INDEX "recipes_proteins_idx" ON "recipes" USING GIN ("proteins");

-- CreateIndex
CREATE INDEX "recipes_public_diets_idx" ON recipes USING GIN (diets) WHERE "isPublic" = true;

-- CreateIndex
CREATE INDEX "recipes_public_proteins_idx" ON recipes USING GIN (proteins) WHERE "isPublic" = true;

-- CreateIndex
CREATE INDEX "recipes_isPublic_preparationTimeInMinutes_idx" ON "recipes"("isPublic", "preparationTimeInMinutes");

-- CreateIndex
CREATE INDEX "recipes_isPublic_cookingTimeInMinutes_idx" ON "recipes"("isPublic", "cookingTimeInMinutes");

-- CreateIndex
CREATE INDEX "user_follows_followingId_idx" ON "user_follows"("followingId");

-- CreateIndex
CREATE INDEX "user_follows_userId_createdAt_idx" ON "user_follows"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "user_follows_followingId_createdAt_idx" ON "user_follows"("followingId", "createdAt" DESC);
