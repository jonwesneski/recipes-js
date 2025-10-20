import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '@src/common/common.responses';

export class TagNamesResponse {
  @ApiProperty({ type: [String] })
  data: string[];
  @ApiProperty({ type: PaginationResponse })
  pagination: PaginationResponse;
}
