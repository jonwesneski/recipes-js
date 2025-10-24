import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PutBookmarkRecipeDto {
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  bookmark: boolean;
}
