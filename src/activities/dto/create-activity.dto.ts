import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ActivityEntityType } from '@prisma/client';

export class CreateActivityDto {
  @ApiProperty({ description: 'Activity type (e.g. CREATE, UPDATE, DELETE, STATUS_CHANGE)' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Human-readable description of the activity' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ActivityEntityType, description: 'Type of entity this activity relates to' })
  @IsNotEmpty()
  @IsEnum(ActivityEntityType)
  entityType: ActivityEntityType;

  @ApiProperty({ description: 'UUID of the related entity' })
  @IsNotEmpty()
  @IsString()
  entityId: string;

  @ApiProperty({ description: 'UUID of the user who performed the action' })
  @IsNotEmpty()
  @IsString()
  performedBy: string;

  @ApiPropertyOptional({ description: 'Additional metadata (e.g. old/new values)' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
