import { ApiProperty } from '@nestjs/swagger';

export class PaginationEntity {
  @ApiProperty({ type: Number })
  total_records: number;
  @ApiProperty({ type: Number })
  current_page: number;
  @ApiProperty({ type: Number })
  total_pages: number;
  @ApiProperty({ type: Number, nullable: true })
  next_page: number | null;
  @ApiProperty({ type: Number, nullable: true })
  prev_page: number | null;
}

export class TagNamesEntity {
  @ApiProperty({ type: [String] })
  data: string[];
  @ApiProperty({ type: PaginationEntity })
  pagination: PaginationEntity;
}
