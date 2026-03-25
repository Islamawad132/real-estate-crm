import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { ActivityEntityType } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

export class ActivityFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by activity type (e.g. CREATE, UPDATE, DELETE)' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ enum: ActivityEntityType, description: 'Filter by entity type' })
  @IsOptional()
  @IsEnum(ActivityEntityType)
  entityType?: ActivityEntityType;

  @ApiPropertyOptional({ description: 'Filter by entity ID' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({ description: 'Filter by performer ID' })
  @IsOptional()
  @IsString()
  performedBy?: string;

  @ApiPropertyOptional({ description: 'Start date filter (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'End date filter (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
