import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAgentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
