import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ description: 'Recipient email address', example: 'agent@example.com' })
  @IsEmail()
  @IsNotEmpty()
  to!: string;

  @ApiProperty({ description: 'Email subject', example: 'Important Update' })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({ description: 'Handlebars template name', example: 'lead-assignment' })
  @IsString()
  @IsNotEmpty()
  template!: string;

  @ApiPropertyOptional({ description: 'Template context variables', example: { agentName: 'John' } })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}
