import { ApiProperty } from '@nestjs/swagger';
import { RecipeFiltersDto, RecipeListResponse } from '@src/recipes';

export class AiRecipesSearchResponse extends RecipeListResponse {
  @ApiProperty({ type: RecipeFiltersDto })
  generatedFilters: RecipeFiltersDto;
}
