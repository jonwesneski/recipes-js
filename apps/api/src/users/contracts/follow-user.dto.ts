import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PatchFollowUserDto {
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  follow: boolean;
}
