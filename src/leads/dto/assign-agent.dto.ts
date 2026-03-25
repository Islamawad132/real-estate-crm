import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignAgentDto {
  @ApiProperty({ description: 'Agent user ID to assign' })
  @IsNotEmpty()
  @IsUUID()
  agentId: string;
}
