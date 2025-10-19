import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '@src/common/common.responses';

export class TagNamesEntity {
  @ApiProperty({ type: [String] })
  data: string[];
  @ApiProperty({ type: PaginationResponse })
  pagination: PaginationResponse;
}
