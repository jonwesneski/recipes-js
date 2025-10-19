import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse {
  @ApiProperty({ type: Number })
  totalRecords: number;
  @ApiProperty({ type: String, nullable: true })
  currentCursor: string | null;
  @ApiProperty({ type: String, nullable: true })
  nextCursor: string | null;
}
