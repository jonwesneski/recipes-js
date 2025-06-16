import { ApiProperty } from '@nestjs/swagger';

export class PaginationEntity {
  @ApiProperty({ type: Number })
  totalRecords: number;
  @ApiProperty({ type: Number })
  currentCursor: number;
  @ApiProperty({ type: Number, nullable: true })
  nextCursor: number | null;
}

export class TagNamesEntity {
  @ApiProperty({ type: [String] })
  data: string[];
  @ApiProperty({ type: PaginationEntity })
  pagination: PaginationEntity;
}
