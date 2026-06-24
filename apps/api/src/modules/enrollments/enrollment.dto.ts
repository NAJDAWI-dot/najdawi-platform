import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @IsString()
  @IsOptional()
  completedItemId?: string;
}
