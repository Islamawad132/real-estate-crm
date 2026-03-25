import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReportType {
  MONTHLY_REVENUE = 'monthly_revenue',
  AGENT_PERFORMANCE = 'agent_performance',
}

export class GenerateReportDto {
  @ApiProperty({ enum: ReportType, description: 'Type of report to generate' })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiPropertyOptional({ description: 'Month in YYYY-MM format (defaults to current month)' })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({ description: 'Agent ID (required for agent_performance report)' })
  @IsOptional()
  @IsUUID()
  agentId?: string;
}
