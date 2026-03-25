import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LeadStatus } from '@prisma/client';

export class ChangeLeadStatusDto {
  @ApiProperty({ description: 'New lead status', enum: LeadStatus })
  @IsNotEmpty()
  @IsEnum(LeadStatus)
  status: LeadStatus;

  @ApiPropertyOptional({ description: 'Optional notes about the status change' })
  @IsOptional()
  @IsString()
  notes?: string;
}
