import { ApiProperty } from '@nestjs/swagger';

export class PaginationEntity {
  @ApiProperty({ type: Number })
  totalRecords: number;
  @ApiProperty({ type: String })
  currentCursor: string;
  @ApiProperty({ type: String, nullable: true })
  nextCursor: string | null;
}

export class TagNamesEntity {
  @ApiProperty({ type: [String] })
  data: string[];
  @ApiProperty({ type: PaginationEntity })
  pagination: PaginationEntity;
}
