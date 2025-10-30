import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetRecipesSearchDto {
  @IsString()
  @ApiProperty({ type: String })
  input: string;
}
